import React from 'react';
import HeaderNav from '../components/Common/HeaderNav';
import Footer from '../components/Common/Footer';
import { useDashboardInit } from '../hooks/useDashboardInit';

const UserLayout = ({
    children,
    activeTab = 'overview',
    onTabChange,
    logo,
    logoText = "JobMate",
    avatarUrl = null
}) => {
    const { userInfo, loading } = useDashboardInit();

    if (loading) {
        return (
            <div className="app-shell flex items-center justify-center">
                <div className="text-center">
                    <p className="font-medium text-slate-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell flex flex-col">
            <HeaderNav
                activeTab={activeTab}
                onTabChange={onTabChange}
                userInfo={userInfo}
                avatarUrl={avatarUrl}
                logo={logo}
                logoText={logoText}
            />
            <main className="app-main flex-1">
                {children}
            </main>
            <Footer  logo={logo} logoText={logoText} />
        </div>
    );
};

export default UserLayout;
