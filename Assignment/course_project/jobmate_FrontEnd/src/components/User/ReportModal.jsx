import React, { useState } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import { submitReport } from "../../services/reportService";
import { showWarning } from "../../utils/toast";

const ReportModal = ({ isOpen, onClose, targetType, targetId, targetTitle }) => {
    
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            showWarning("Vui lòng nhập lý do báo cáo");
            return;
        }

        try {
            setIsSubmitting(true);
            await submitReport({
                targetType: targetType,
                targetId: targetId,
                reason: reason.trim()
            });

            setIsSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            showWarning(error?.response?.data?.message || "Không thể gửi báo cáo. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setReason("");
            setIsSuccess(false);
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }
    const getTargetTypeLabel = () => {
        switch (targetType) {
            case "JOB":
                return "công việc";
            case "USER":
                return "người dùng";
            case "RATING":
                return "đánh giá";
            default:
                return "nội dung";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/50">
            <div className="bg-white rounded-3xl border border-primary-200 shadow-premium max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-primary-200">
                    <div>
                        <h2 className="text-xl font-semibold text-primary-900">Báo cáo {getTargetTypeLabel()}</h2>
                        {targetTitle && (
                            <p className="text-sm text-primary-500 mt-1">{targetTitle}</p>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <X size={20} className="text-primary-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                                <Check className="h-8 w-8 text-success" />
                            </div>
                            <h3 className="text-lg font-semibold text-primary-900 mb-2">Báo cáo thành công!</h3>
                            <p className="text-primary-600 mb-6">
                                Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.
                            </p>
                            <button
                                onClick={handleClose}
                                className="app-btn-primary"
                            >
                                Đóng
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Info Note */}
                            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-brand-800">
                                        <strong>Lưu ý:</strong> Báo cáo của bạn sẽ được xem xét bởi đội ngũ quản trị viên. 
                                        Vui lòng cung cấp thông tin chính xác và chi tiết để chúng tôi có thể xử lý tốt nhất.
                                    </p>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-primary-900">Lý do báo cáo *</h4>
                                <textarea
                                    placeholder="Vui lòng mô tả chi tiết lý do bạn báo cáo nội dung này..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="app-input min-h-32 resize-none"
                                    maxLength={1000}
                                />
                                <p className="text-xs text-primary-400">{reason.length}/1000 ký tự</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="app-btn-secondary disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !reason.trim()}
                                    className="app-btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span> Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={16} /> Gửi báo cáo
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModal;

