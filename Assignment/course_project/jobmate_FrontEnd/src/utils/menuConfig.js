import { LayoutDashboard, Briefcase, ClipboardList, MessageSquare, Building2, UserCheck, Search, Settings, Users, BarChart3, Shield, Send, Calendar, FileText, Sparkles, User, AlertTriangle, History } from 'lucide-react';

// Menu chính trên Header cho User (Các luồng chính)
export const userHeaderItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'find-jobs', label: 'Tìm việc làm', icon: Briefcase },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
];

// Menu phụ trong Dropdown/Sidebar cho User (Quản lý cá nhân)
export const userAccountItems = [
    { id: 'profile', label: 'Hồ sơ của tôi', icon: User },
    { id: 'applications', label: 'Ứng tuyển của tôi', icon: Send },
    { id: 'job-requests', label: 'Yêu cầu tìm việc', icon: Sparkles },
];

// Giữ lại menu cũ cho Employer & Admin (Vẫn dùng Sidebar)
export const employerMenuItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'post-job', label: 'Đăng tin tuyển dụng', icon: Briefcase },
    { id: 'manage-jobs', label: 'Quản lý tin tuyển dụng', icon: ClipboardList },
    { id: 'search-candidates', label: 'Tìm ứng viên', icon: Search },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare },
    { id: 'profile', label: 'Hồ sơ', icon: User },
];

export const adminMenuItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'job-review', label: 'Duyệt công việc', icon: ClipboardList },
    { id: 'reports', label: 'Báo cáo vi phạm', icon: AlertTriangle },
    { id: 'verifications', label: 'Xác minh CCCD', icon: Shield },
    { id: 'audit-logs', label: 'Nhật ký hệ thống', icon: History },
];

// Fallback function
export const getMenuItemsByRole = (role) => {
    if (role === 'Admin') return adminMenuItems;
    if (role === 'Employer') return employerMenuItems;
    return [...userHeaderItems, ...userAccountItems];
};
