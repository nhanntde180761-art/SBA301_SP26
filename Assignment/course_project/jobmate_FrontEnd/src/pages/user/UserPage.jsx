import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import UserLayout from '../../layouts/UserLayout';
import { getUserInfo } from '../../services/userService';
import logoImg from '/logo.jpg';
import PasswordSetupModal from '../../components/Common/PasswordSetupModal';
import { DashboardSkeleton, ListSkeleton } from '../../components/Common/Skeleton';
import { MessageNotificationProvider } from '../../contexts/MessageNotificationContext.jsx';


// Lazy load các components để tối ưu hiệu năng
const Dashboard = lazy(() => import('./Dashboard'));
const JobList = lazy(() => import('./JobList'));
const JobListDetail = lazy(() => import('./JobListDetail'));
const Application = lazy(() => import('./Application'));
const ApplicationDetail = lazy(() => import('./ApplicationDetail'));
const JobRequest = lazy(() => import('./JobRequest'));
const Profile = lazy(() => import('./Profile'));
const MessagesPage = lazy(() => import('../Common/MessagePage'));

const UserPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordSetupData, setPasswordSetupData] = useState(null);

    // Đồng bộ state activeTab với URL search params
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    // Cập nhật tab từ URL khi có thay đổi (ví dụ: nhấn nút Back của trình duyệt)
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);

    // Cập nhật Document Title cho SEO và trải nghiệm người dùng
    useEffect(() => {
        const tabNames = {
            'overview': 'Tổng quan',
            'find-jobs': 'Tìm việc làm',
            'job-detail': 'Chi tiết công việc',
            'applications': 'Ứng tuyển của tôi',
            'application-detail': 'Chi tiết ứng tuyển',
            'messages': 'Tin nhắn',
            'profile': 'Hồ sơ cá nhân',
            'job-requests': 'Yêu cầu tìm việc'
        };
        const currentTabName = tabNames[activeTab] || 'Người dùng';
        document.title = `JobMate | ${currentTabName}`;
    }, [activeTab]);

    // Kiểm tra xem có cần hiển thị modal setup password không
    useEffect(() => {
        const showSetup = localStorage.getItem('showPasswordSetup');
        const authResponseStr = localStorage.getItem('authResponse');

        if (showSetup === 'true' && authResponseStr) {
            try {
                const authResponse = JSON.parse(authResponseStr);
                if (authResponse?.requiresPasswordSetup) {
                    setPasswordSetupData({
                        userEmail: authResponse.userEmail,
                        userName: authResponse.userName || authResponse.userEmail,
                        userId: authResponse.userId
                    });
                    setShowPasswordModal(true);
                }
            } catch (error) {
                console.error('Error parsing authResponse:', error);
            } finally {
                localStorage.removeItem('showPasswordSetup');
                localStorage.removeItem('authResponse');
            }
        }
    }, []);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const res = await getUserInfo();
                if (res?.data?.data) {
                    const userData = res.data.data;
                    setUserInfo(userData);
                    setAvatarUrl(userData.avatarUrl || userData.avatar || null);
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin user:', error);
            }
        };
        loadUserInfo();
    }, []);

    const handleAvatarChange = (newUrl) => {
        setAvatarUrl(newUrl || null);
        setUserInfo((prev) => (prev ? { ...prev, avatarUrl: newUrl } : prev));
    };

    const handleProfileUpdate = (updatedProfile) => {
        if (!updatedProfile) return;
        setUserInfo((prev) => (prev ? { ...prev, ...updatedProfile } : updatedProfile));
        if (updatedProfile.avatarUrl) {
            setAvatarUrl(updatedProfile.avatarUrl);
        }
    };

    const renderContent = () => {
        return (
            <Suspense fallback={activeTab === 'overview' ? <DashboardSkeleton /> : <ListSkeleton />}>
                {(() => {
                    switch (activeTab) {
                        case 'overview':
                            return <Dashboard onTabChange={handleTabChange} />;
                        case 'find-jobs':
                            return (
                                <JobList
                                    userInfo={userInfo}
                                    onViewDetail={(id) => {
                                        setSelectedJobId(id);
                                        handleTabChange('job-detail');
                                    }}
                                />
                            );
                        case 'job-detail':
                            return (
                                <JobListDetail
                                    id={selectedJobId}
                                    onBack={() => handleTabChange('find-jobs')}
                                    onStartChat={() => handleTabChange('messages')}
                                    userInfo={userInfo}
                                />
                            );
                        case 'applications':
                            return (
                                <Application
                                    onViewDetail={(id) => {
                                        setSelectedApplicationId(id);
                                        handleTabChange('application-detail');
                                    }}
                                    onStartChat={() => handleTabChange('messages')}
                                />
                            );
                        case 'application-detail':
                            return (
                                <ApplicationDetail
                                    id={selectedApplicationId}
                                    onBack={() => handleTabChange('applications')}
                                    onStartChat={() => handleTabChange('messages')}
                                />
                            );
                        case 'messages':
                            return <MessagesPage />;
                        case 'profile':
                            return (
                                <Profile
                                    onAvatarChange={handleAvatarChange}
                                    onProfileUpdate={handleProfileUpdate}
                                />
                            );
                        case 'job-requests':
                            return <JobRequest onStartChat={() => handleTabChange('messages')} />;
                        default:
                            return (
                                <div className="text-center py-12">
                                    <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
                                    <p className="text-gray-600">Nội dung đang được phát triển...</p>
                                </div>
                            );
                    }
                })()}
            </Suspense>
        );
    };

    return (
        <MessageNotificationProvider>
            <UserLayout
                activeTab={activeTab}
                onTabChange={handleTabChange}
                logo={logoImg}
                logoText="JobMate"
                avatarUrl={avatarUrl}
            >
                {renderContent()}
            </UserLayout>

            {/* Modal setup password cho Google OAuth users */}
            {showPasswordModal && passwordSetupData && (
                <PasswordSetupModal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    userEmail={passwordSetupData.userEmail}
                    userName={passwordSetupData.userName}
                    userId={passwordSetupData.userId}
                />
            )}
        </MessageNotificationProvider>
    );
};

export default UserPage;
