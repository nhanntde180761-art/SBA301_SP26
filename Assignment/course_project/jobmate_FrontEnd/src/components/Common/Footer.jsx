import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = ({ logo, logoText }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-primary-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4">
                            {logo ? (
                                <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
                            ) : (
                                <div className="bg-brand-600 p-1.5 rounded-lg mr-2">
                                    <div className="h-4 w-4 bg-white rounded-sm"></div>
                                </div>
                            )}
                            <span className="text-xl font-bold text-primary-900">{logoText || 'JobMate'}</span>
                        </div>
                        <p className="text-primary-500 text-sm leading-relaxed">
                            Nền tảng kết nối việc làm hiện đại, giúp ứng viên tìm kiếm cơ hội và nhà tuyển dụng tìm thấy nhân tài phù hợp nhất.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-primary-400 hover:text-brand-600 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-primary-400 hover:text-brand-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-primary-400 hover:text-brand-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-primary-900 uppercase tracking-wider mb-4">Dành cho ứng viên</h3>
                        <ul className="space-y-2">
                            <li><a href="?tab=find-jobs" className="text-primary-500 hover:text-brand-600 text-sm">Tìm việc làm</a></li>
                            <li><a href="?tab=applications" className="text-primary-500 hover:text-brand-600 text-sm">Ứng tuyển của tôi</a></li>
                            <li><a href="?tab=job-requests" className="text-primary-500 hover:text-brand-600 text-sm">Yêu cầu tìm việc</a></li>
                            <li><a href="?tab=profile" className="text-primary-500 hover:text-brand-600 text-sm">Hồ sơ cá nhân</a></li>
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-primary-900 uppercase tracking-wider mb-4">Thông tin</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-primary-500 hover:text-brand-600 text-sm">Về chúng tôi</a></li>
                            <li><a href="#" className="text-primary-500 hover:text-brand-600 text-sm">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="text-primary-500 hover:text-brand-600 text-sm">Chính sách bảo mật</a></li>
                            <li><a href="#" className="text-primary-500 hover:text-brand-600 text-sm">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-primary-900 uppercase tracking-wider mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0" />
                                <span className="text-primary-500 text-sm">Khu Công nghệ cao, Quận 9, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0" />
                                <span className="text-primary-500 text-sm">0123 456 789</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-brand-500 mr-2 flex-shrink-0" />
                                <span className="text-primary-500 text-sm">support@jobmate.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-100 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-primary-400 text-xs mb-4 md:mb-0">
                        &copy; {currentYear} JobMate. Tất cả quyền được bảo lưu.
                    </p>
                    <div className="flex space-x-6">
                        <span className="text-primary-400 text-xs hover:text-brand-600 cursor-pointer">Vietnamese</span>
                        <span className="text-primary-400 text-xs hover:text-brand-600 cursor-pointer">English</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
