import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../services/localStorageService';
import {
    getMyConversations,
    getMessagesOfConversation,
    createMessage,
    deleteConversation
} from '../services/chatService';
import { showError, showSuccess } from '../utils/toast';
import { useMessageNotification } from './useMessageNotification';

const getCurrentUserId = () => {
    try {
        const token = getToken();
        if (!token) return null;
        const decoded = jwtDecode(token);
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

export const useChat = () => {
    const { setIsOnMessagesPage, setViewedConversationId, syncUnreadCount } = useMessageNotification();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    
    const selectedConversationRef = useRef(null);
    const processedMessagesRef = useRef(new Set());
    const bottomRef = useRef(null);

    // Sync selected conversation to ref and notification context
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
        setViewedConversationId(selectedConversation?.id || null);
    }, [selectedConversation, setViewedConversationId]);

    // Initialize Socket
    useEffect(() => {
        setIsOnMessagesPage(true);
        const token = getToken();
        if (!token) return;

        const newSocket = io(import.meta.env.VITE_SOCKET_IO_ENDPOINT, {
            transports: ['websocket'],
            query: { token },
            reconnection: true,
        });

        newSocket.on("connect", () => {
            // Join existing rooms
            conversations.forEach(conv => {
                newSocket.emit('joinRoom', String(conv.id));
            });
        });

        const handleNewMessage = (data) => {
            const message = typeof data === "string" ? JSON.parse(data) : data;
            if (!message || !message.conversationId) return;

            const messageId = String(message.id || `${message.conversationId}-${message.createdDate}`);
            if (processedMessagesRef.current.has(messageId)) return;
            processedMessagesRef.current.add(messageId);

            const currentUserId = getCurrentUserId();
            const isMe = message.sender?.userId === currentUserId;
            const isViewing = String(selectedConversationRef.current?.id) === String(message.conversationId);

            // Update Messages if viewing
            if (isViewing) {
                setMessages(prev => [...prev, { ...message, me: isMe }]);
            }

            // Update Conversations List
            setConversations(prev => {
                const index = prev.findIndex(c => String(c.id) === String(message.conversationId));
                if (index === -1) return prev;

                const updated = [...prev];
                const conv = updated[index];
                const shouldIncr = !isMe && !isViewing;

                updated[index] = {
                    ...conv,
                    lastMessage: message.message || conv.lastMessage,
                    timestamp: new Date().toISOString(),
                    unread: shouldIncr ? (conv.unread || 0) + 1 : 0
                };

                // Re-sync unread count
                const total = updated.reduce((s, c) => s + (c.unread || 0), 0);
                syncUnreadCount(total);

                return updated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            });
        };

        newSocket.on('message', handleNewMessage);
        setSocket(newSocket);

        return () => {
            setIsOnMessagesPage(false);
            setViewedConversationId(null);
            newSocket.disconnect();
        };
    }, [syncUnreadCount]);

    // Fetch Conversations
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getMyConversations();
                const data = (res.data.data || []).map(c => {
                    const other = (c.participants || []).find(p => p.userId !== getCurrentUserId());
                    const otherAvatar = other?.avatarUrl || other?.avatar || other?.profilePicture || c.conversationAvatar || null;
                    return {
                        id: c.id,
                        name: other?.fullName || c.conversationName || 'User',
                        avatar: otherAvatar,
                        lastMessage: c.lastMessage || 'Chưa có tin nhắn',
                        timestamp: c.modifiedDate || new Date().toISOString(),
                        unread: c.unreadCount || 0,
                    };
                });
                setConversations(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
                syncUnreadCount(data.reduce((s, c) => s + (c.unread || 0), 0));
            } catch (err) {
                showError("Lỗi khi tải hội thoại");
            }
        };
        fetch();
    }, [syncUnreadCount]);

    // Fetch Messages when conversation changes
    useEffect(() => {
        if (!selectedConversation?.id) return;
        
        const fetchMsgs = async () => {
            setLoadingMessages(true);
            try {
                const res = await getMessagesOfConversation(selectedConversation.id);
                const currentUserId = getCurrentUserId();
                const msgs = (res.data.data || []).map(m => ({
                    ...m,
                    me: m.sender?.userId === currentUserId
                })).sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
                setMessages(msgs);
                if (socket) socket.emit('joinRoom', String(selectedConversation.id));
            } catch (err) {
                showError("Lỗi khi tải tin nhắn");
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMsgs();
    }, [selectedConversation?.id, socket]);

    // Scroll to bottom - optimized to prevent jumping
    useEffect(() => {
        const scrollTimer = requestAnimationFrame(() => {
            if (bottomRef.current) {
                bottomRef.current.parentElement?.scrollTo({
                    top: bottomRef.current.parentElement.scrollHeight,
                    behavior: 'auto'
                });
            }
        });
        return () => cancelAnimationFrame(scrollTimer);
    }, [messages, selectedConversation?.id]);

    const sendMessage = async (text) => {
        if (!text.trim() || !selectedConversation) return;

        try {
            const res = await createMessage({ conversationId: selectedConversation.id, message: text });
            const apiMsg = res?.data?.data || res?.data;

            // Only add message once from API to prevent double render
            setMessages(prev => {
                const alreadyExists = prev.some(m => String(m.id) === String(apiMsg?.id));
                if (alreadyExists) return prev;
                return [...prev, { ...apiMsg, me: true }];
            });

            // Update conversation list
            setConversations(prev => {
                const updated = prev.map(c => c.id === selectedConversation.id ? 
                    { ...c, lastMessage: text, timestamp: new Date().toISOString(), unread: 0 } : c);
                return updated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            });
        } catch (err) {
            showError("Lỗi khi gửi tin nhắn");
        }
    };

    const removeConversation = async (id) => {
        if (!window.confirm("Xóa hội thoại này?")) return;
        try {
            await deleteConversation(id);
            setConversations(prev => prev.filter(c => c.id !== id));
            if (selectedConversation?.id === id) setSelectedConversation(null);
            showSuccess("Đã xóa");
        } catch (err) {
            showError("Không thể xóa");
        }
    };

    return {
        conversations,
        selectedConversation,
        setSelectedConversation,
        messages,
        sendMessage,
        removeConversation,
        loadingMessages,
        bottomRef,
        currentUserId: getCurrentUserId()
    };
};
