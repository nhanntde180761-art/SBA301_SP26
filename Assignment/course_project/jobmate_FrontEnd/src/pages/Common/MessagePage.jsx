import React, { useState } from 'react';
import { Search, Send, MoreVertical, Hash, User, MessageCircle } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

const MessagePage = () => {
    const {
        conversations,
        selectedConversation,
        setSelectedConversation,
        messages,
        sendMessage,
        removeConversation,
        loadingMessages,
        bottomRef,
        currentUserId
    } = useChat();

    const [searchTerm, setSearchTerm] = useState('');
    const [msgInput, setMsgInput] = useState('');
    const [activeMenu, setActiveMenu] = useState(null);

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSend = (e) => {
        e.preventDefault();
        if (!msgInput.trim()) return;
        sendMessage(msgInput);
        setMsgInput('');
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-surface-100 rounded-3xl overflow-hidden border border-primary-100 shadow-premium">
            {/* Left Sidebar: Conversations List */}
            <div className="w-80 lg:w-96 border-r border-primary-100 bg-white flex flex-col">
                <div className="p-6 border-b border-primary-50">
                    <h2 className="text-2xl font-black text-primary-900 mb-4 flex items-center gap-2">
                        <MessageCircle className="text-brand-600" /> Tin nhắn
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            className="app-input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => {
                                const avatarSrc = conv.avatar || conv.avatarUrl || conv.profilePicture || null;
                                const avatar = avatarSrc ? `${avatarSrc}${avatarSrc.includes('?') ? '&' : '?'}v=${conv.timestamp || Date.now()}` : null;

                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`group relative mx-2 mb-1 p-3 rounded-2xl cursor-pointer flex items-center gap-3 ${
                                        selectedConversation?.id === conv.id 
                                        ? 'bg-brand-50' 
                                        : 'hover:bg-surface-100'
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg overflow-hidden border border-brand-200">
                                            {avatar ? (
                                                <img src={avatar} alt={conv.name} className="w-full h-full object-cover" />
                                            ) : (
                                                conv.name.charAt(0)
                                            )}
                                        </div>
                                        {conv.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                                {conv.unread}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className={`text-sm font-bold truncate ${selectedConversation?.id === conv.id ? 'text-brand-700' : 'text-primary-900'}`}>
                                                {conv.name}
                                            </h4>
                                            <span className="text-[10px] text-primary-400 font-medium whitespace-nowrap">
                                                {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-primary-500 truncate italic">
                                            {conv.lastMessage}
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeConversation(conv.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-lg text-primary-400 hover:text-accent-rose transition-all"
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-primary-400 opacity-60">
                            <Hash size={40} className="mb-2" />
                            <p className="text-sm">Không tìm thấy cuộc trò chuyện</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-primary-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                                    {selectedConversation.avatar ? (
                                        <img src={selectedConversation.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary-900 leading-none mb-1">{selectedConversation.name}</h3>
                                    <p className="text-[10px] text-accent-emerald font-bold uppercase tracking-wider">Đang hoạt động</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-50 custom-scrollbar scroll-smooth">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-primary-300">
                                    <p>Chưa có tin nhắn nào</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.me ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] lg:max-w-[60%] flex flex-col ${msg.me ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium shadow-soft ${
                                                msg.me 
                                                ? 'bg-brand-600 text-white rounded-br-none shadow-brand-200' 
                                                : 'bg-white text-primary-800 rounded-bl-none border border-primary-100'
                                            }`}>
                                                {msg.message}
                                            </div>
                                            <span className="text-[10px] text-primary-400 mt-1 font-semibold uppercase tracking-tighter">
                                                {new Date(msg.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={bottomRef} className="h-0" />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 bg-white border-t border-primary-50">
                            <form onSubmit={handleSend} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={msgInput}
                                    onChange={(e) => setMsgInput(e.target.value)}
                                    placeholder="Nhập tin nhắn của bạn..."
                                    className="app-input bg-surface-100 border-transparent focus:bg-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!msgInput.trim()}
                                    className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 hover:bg-brand-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-surface-50">
                        <div className="w-24 h-24 bg-brand-50 rounded-3xl flex items-center justify-center text-brand-600 mb-6 animate-bounce duration-[3000ms]">
                            <MessageCircle size={48} />
                        </div>
                        <h3 className="text-xl font-black text-primary-900 mb-2">Cuộc trò chuyện của bạn</h3>
                        <p className="text-primary-500 max-w-xs">Chọn một cuộc trò chuyện từ thanh bên để bắt đầu nhắn tin với ứng viên hoặc nhà tuyển dụng.</p>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default MessagePage;
