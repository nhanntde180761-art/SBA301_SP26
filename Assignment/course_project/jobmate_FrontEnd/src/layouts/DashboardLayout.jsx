import React, { useState } from 'react';
import Sidebar from '../components/Common/SideBar';
import TopBar from '../components/Common/TopBar';
import { useDashboardInit } from '../hooks/useDashboardInit';

const DashboardLayout = ({
    children,
    activeTab = 'overview',
    onTabChange,
    menuItems,
    logo = "/vite.svg",
    logoText = "JobMate",
    avatarUrl = null
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { userInfo, internalMenuItems, loading } = useDashboardInit(menuItems);

    if (loading) {
        return (
            <div className="app-shell flex items-center justify-center">
                <div className="text-center">
                    <p className="font-medium text-slate-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    const handleTabChange = (tabId) => {
        if (onTabChange) {
            onTabChange(tabId);
        }
    };

    return (
        <div className="app-shell h-screen flex overflow-hidden">
            <Sidebar
                sidebarItems={internalMenuItems}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                logo={logo}
                logoText={logoText}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar
                    inFor={userInfo?.fullName || ''}
                    role={userInfo?.role || 'Student'}
                    avatar={avatarUrl}
                    onTabChange={handleTabChange}
                />
                <div className="flex-1 overflow-y-auto">
                    <div className="app-main py-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
