import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, Menu, X, Briefcase } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { logout } from '../../services/authService';
import { removeToken } from '../../services/localStorageService';

import { useMessageNotification } from '../../hooks/useMessageNotification';
import { userHeaderItems, userAccountItems } from '../../utils/menuConfig';

const HeaderNav = ({ activeTab, onTabChange, userInfo, avatarUrl, logo, logoText }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { unreadCount } = useMessageNotification();

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        removeToken();
        window.location.href = '/login';
    };

    const getRoleText = (role) => {
        if (!role) return 'Người dùng';
        const roleLower = role.toLowerCase();
        if (roleLower.includes('admin')) return 'Quản trị viên';
        if (roleLower.includes('employer')) return 'Nhà tuyển dụng';
        return 'Người dùng';
    };

    const isTabActive = (tabId) => {
        if (activeTab === tabId) return true;
        return (
            (tabId === 'find-jobs' && activeTab === 'job-detail') ||
            (tabId === 'applications' && activeTab === 'application-detail')
        );
    };

    const avatarSrc = avatarUrl || userInfo?.avatarUrl || userInfo?.avatar || userInfo?.profilePicture || null;
    const displayName = userInfo?.fullName || 'Người dùng';
    const initial = displayName?.[0]?.toUpperCase() || 'U';

    return (
        <header
            className="sticky top-0 w-full border-b border-primary-200 bg-white shadow-soft transition-all duration-300"
            style={{ zIndex: 100 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left: Brand & Nav */}
                    <div className="flex items-center gap-10">
                        <button
                            type="button"
                            className="group flex items-center gap-2"
                            onClick={() => onTabChange('overview')}
                        >
                            {logo ? (
                                <img 
                                    src={logo} 
                                    alt="Logo" 
                                    className="h-10 w-auto rounded-xl shadow-lg"
                                />
                            ) : (
                                <div className="rounded-2xl bg-brand-600 p-2 shadow-soft">
                                    <Briefcase className="h-6 w-6 text-white" />
                                </div>
                            )}
                            <span className="text-xl font-black tracking-tight text-primary-900">{logoText || 'JobMate'}</span>
                        </button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {userHeaderItems.map((item) => {
                                const isActive = isTabActive(item.id);
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onTabChange(item.id)}
                                        className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all relative group flex items-center gap-2 ${
                                            isActive
                                                ? 'text-brand-700 bg-brand-50'
                                                : 'text-primary-500 hover:bg-primary-100 hover:text-brand-700'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-primary-400 group-hover:text-brand-700'}`} />
                                        <span>{item.label}</span>
                                        {item.id === 'messages' && unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-soft">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-600 rounded-full"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right: User Section */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex">
                             <NotificationBell />
                        </div>

                        <div className="mx-2 hidden h-10 w-[1px] bg-primary-200 md:block"></div>

                        {/* User Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 rounded-2xl border border-primary-200 bg-white p-1.5 transition-all duration-300 hover:border-brand-200 hover:shadow-soft"
                                aria-label="Menu người dùng"
                            >
                                <div className="w-9 h-9 rounded-xl overflow-hidden bg-brand-50 flex items-center justify-center border border-brand-100 shrink-0">
                                     {avatarSrc ? (
                                         <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                                     ) : (
                                         <span className="text-brand-700 font-black text-sm uppercase">
                                             {initial}
                                         </span>
                                     )}
                                </div>
                                <div className="hidden lg:block text-left mr-1">
                                    <p className="text-xs font-bold leading-none text-primary-900">{displayName}</p>
                                    <p className="mt-1 text-[10px] font-medium text-primary-500">{getRoleText(userInfo?.role)}</p>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-primary-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 top-full mt-3 w-64 origin-top-right rounded-3xl border border-primary-200 bg-white py-3 shadow-premium transition-opacity duration-200"
                                    style={{ zIndex: 101 }}
                                >
                                    <div className="mb-3 border-b border-primary-100 px-5 pb-3 lg:hidden">
                                        <p className="text-sm font-bold text-primary-900">{userInfo?.fullName}</p>
                                        <p className="text-xs text-primary-500">{getRoleText(userInfo?.role)}</p>
                                    </div>

                                    {userAccountItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    onTabChange(item.id);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors ${
                                                    isActive 
                                                    ? 'text-brand-700 bg-brand-50' 
                                                    : 'text-primary-600 hover:bg-primary-100 hover:text-brand-700'
                                                 }`}
                                            >
                                                <div className={`rounded-lg p-1.5 ${isActive ? 'bg-brand-100 text-brand-700' : 'bg-primary-100 text-primary-400'}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                    
                                    <hr className="my-2 border-primary-100" />
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-error hover:bg-error/10 transition-colors"
                                    >
                                        <div className="p-1.5 rounded-lg bg-error/10 text-error">
                                            <LogOut className="w-4 h-4" />
                                        </div>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-2xl bg-primary-100 p-2.5 text-primary-600 transition-colors hover:text-brand-700 focus:outline-none md:hidden"
                            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="border-b border-primary-200 bg-white md:hidden">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary-400">Khám phá</p>
                        {userHeaderItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onTabChange(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-3.5 rounded-2xl text-sm font-bold ${
                                    isTabActive(item.id) ? 'bg-brand-50 text-brand-700' : 'text-primary-600 hover:bg-primary-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </div>
                                {item.id === 'messages' && unreadCount > 0 && (
                                    <span className="bg-error text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                        
                        <p className="mt-4 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary-400">Tài khoản</p>
                        {userAccountItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onTabChange(item.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-2xl text-sm font-bold ${
                                    activeTab === item.id ? 'bg-brand-50 text-brand-700' : 'text-primary-600 hover:bg-primary-100'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default HeaderNav;
