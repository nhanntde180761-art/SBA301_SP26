import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';


const PasswordSetupModal = ({ isOpen, onClose, userEmail, userName, userId }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSetupPassword = () => {
        if (!userId) {
            console.error('PasswordSetupModal: Missing userId when navigating to set password');
            return;
        }

        navigate('/set-password', {
            state: { userEmail, userName, userId }
        });
        onClose();
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-primary-900/50 z-40 transition-opacity"
                onClick={handleSkip}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-premium border border-primary-200 max-w-md w-full p-6 relative animate-fade-in">
                    {/* Close Button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 text-primary-400 hover:text-primary-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-brand-600" />
                    </div>

                    {/* Content */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-primary-800 mb-2">
                            Tạo Mật Khẩu?
                        </h2>
                        <p className="text-primary-600 mb-4">
                            Bạn đã đăng nhập thành công qua Google!
                        </p>
                        <p className="text-sm text-primary-500">
                            Tạo mật khẩu để có thể đăng nhập bằng email <span className="font-semibold">{userEmail}</span> trong tương lai.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="bg-brand-50 rounded-xl p-4 mb-6 border border-brand-100">
                        <p className="text-sm font-medium text-brand-900 mb-2">Lợi ích khi tạo mật khẩu:</p>
                        <ul className="text-sm text-brand-800 space-y-1">
                            <li>✓ Đăng nhập bằng email & mật khẩu</li>
                            <li>✓ Không phụ thuộc vào Google</li>
                            <li>✓ Bảo mật tài khoản tốt hơn</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSetupPassword}
                            className="app-btn-primary w-full"
                        >
                            Tạo Mật Khẩu Ngay
                        </button>
                        <button
                            onClick={handleSkip}
                            className="app-btn-secondary w-full"
                        >
                            Để Sau
                        </button>
                    </div>

                    <p className="text-xs text-primary-500 text-center mt-4">
                        Bạn có thể tạo mật khẩu bất cứ lúc nào trong phần Cài đặt
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export default PasswordSetupModal;
