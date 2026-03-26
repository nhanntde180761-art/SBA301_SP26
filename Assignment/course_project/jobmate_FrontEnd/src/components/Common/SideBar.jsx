import { ChevronLeft, LogOut } from 'lucide-react';
import { logout } from '../../services/authService';
import { removeToken } from '../../services/localStorageService';
import { useMessageNotification } from '../../hooks/useMessageNotification';

const Sidebar = ({ sidebarItems, activeTab, setActiveTab, sidebarOpen, setSidebarOpen, logo, logoText }) => {
    const { unreadCount } = useMessageNotification();
    const sidebarContainerClass = sidebarOpen
        ? 'w-64 flex h-full flex-col border-r border-primary-200 bg-white/95 shadow-soft backdrop-blur-sm transition-all duration-300'
        : 'w-20 flex h-full flex-col border-r border-primary-200 bg-white/95 shadow-soft backdrop-blur-sm transition-all duration-300';

    const logoImageClass = sidebarOpen
        ? 'h-10 w-auto max-w-[120px] object-contain flex-shrink-0'
        : 'h-10 w-10 object-contain flex-shrink-0';

    return (
        <div className={sidebarContainerClass}>
            {/* Header */}
            <div className="border-b border-primary-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                        {logo ? (
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className={logoImageClass}
                                />
                                {sidebarOpen && logoText && (
                                    <span className="truncate text-sm font-bold text-primary-900">{logoText}</span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <div className="bg-brand-600 p-2 rounded-lg flex-shrink-0">
                                    <div className="h-5 w-5 bg-white rounded"></div>
                                </div>
                                {sidebarOpen && logoText && (
                                    <span className="text-sm font-bold text-primary-900">{logoText}</span>
                                )}
                            </div>
                        )}
                    </div>
                    {sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 transition-all hover:bg-brand-700"
                        >
                            <ChevronLeft className="h-4 w-4 text-white" />
                        </button>
                    )}
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 transition-all hover:bg-brand-700"
                        >
                            <ChevronLeft className="h-4 w-4 text-white rotate-180" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const menuItemClass = isActive
                            ? 'relative flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-left transition-all bg-brand-600 text-white shadow-soft'
                            : 'relative flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-left transition-all text-primary-700 hover:bg-primary-100';
                        const iconClass = isActive ? 'h-5 w-5 text-white' : 'h-5 w-5 text-primary-500';
                        const labelClass = isActive ? 'flex-1 text-sm font-medium text-white' : 'flex-1 text-sm font-medium text-primary-700';

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={menuItemClass}
                                >
                                    <div className="relative">
                                        <Icon className={iconClass} />
                                        {item.id === 'messages' && unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    {sidebarOpen && (
                                        <span className={labelClass}>
                                            {item.label}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Navigation */}
            <div className="space-y-1 border-t border-primary-200 px-3 py-4">
                <button
                    onClick={() => {
                        logout();
                        removeToken();
                        window.location.href = '/login';
                    }}
                    className="flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-left text-error transition-colors hover:bg-error/10"
                >
                    <LogOut className="h-5 w-5 text-error" />
                    {sidebarOpen && <span className="text-sm font-medium">Đăng xuất</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
