import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { logout } from '../../services/authService';
import { removeToken } from '../../services/localStorageService';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ inFor, role, avatar, onTabChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const chevronClass = dropdownOpen
        ? 'h-4 w-4 text-primary-600 transition-transform rotate-180'
        : 'h-4 w-4 text-primary-600 transition-transform';

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

    const handleProfile = () => {
        setDropdownOpen(false);
        // Nếu có onTabChange (trong dashboard), chuyển tab
        if (onTabChange) {
            onTabChange('profile');
        } else {
            // Nếu không có (ngoài dashboard), navigate đến profile page
            navigate('/profile');
        }
    }

    // Chuyển đổi role sang tiếng Việt
    const getRoleText = (role) => {
        if (!role) return 'Người dùng';
        const roleLower = role.toLowerCase();
        if (roleLower.includes('admin')) return 'Quản trị viên';
        if (roleLower.includes('employer')) return 'Nhà tuyển dụng';
        if (roleLower.includes('user')) return 'Người dùng';
        return 'Người dùng';
    };

    return (
        <div className="relative flex items-center justify-end border-b border-primary-200 bg-white/90 px-6 py-4 shadow-soft backdrop-blur-sm">
            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <NotificationBell />

                {/* User Profile Section */}
                {inFor && (
                    <div className="relative flex items-center space-x-3" ref={dropdownRef}>
                        {/* Avatar */}
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-primary-100 bg-primary-50">
                            {avatar ? (
                                <img 
                                    key={avatar} 
                                    src={avatar} 
                                    alt={inFor} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <span className="text-sm font-semibold text-primary-700">
                                    {inFor?.[0]?.toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-primary-900">{inFor}</span>
                            <span className="text-xs text-primary-500">{getRoleText(role)}</span>
                        </div>

                        {/* Dropdown Icon */}
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="rounded-lg p-1 transition-colors hover:bg-primary-100"
                        >
                            <ChevronDown className={chevronClass} />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-primary-200 bg-white py-2 shadow-soft">
                                <button onClick={handleProfile} className="w-full px-4 py-2 text-left text-sm text-primary-700 hover:bg-primary-100">
                                    Hồ sơ của tôi
                                </button>
                                <hr className="my-2 border-primary-100" />
                                <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10">
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar; 
