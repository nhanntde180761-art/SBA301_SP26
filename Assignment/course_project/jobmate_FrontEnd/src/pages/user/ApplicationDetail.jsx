import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Star,
  Mail,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { getApplicationDetail } from "../../services/applicationService";
import { getJobDetailByIdForUser } from "../../services/jobService";
import RatingModal from "../../components/User/RatingModal";
import { formatWorkingDaysForDisplay } from "../../utils/scheduleUtils";

export default function ApplicationDetail({ id, onBack }) {
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    jobId: null,
    jobTitle: null,
    employerId: null,
    employerName: null
  });

  const loadApplicationDetail = useCallback(async () => {
    if (!id) {
      setApp(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await getApplicationDetail(id);
      const data = response?.data?.data;
      if (data) {
        setApp(data);
      } else {
        console.warn("API không trả về dữ liệu cho application:", id);
        setApp(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết ứng tuyển:", error);
      setApp(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApplicationDetail();
  }, [loadApplicationDetail]);

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { label: "Đang xem xét", color: "bg-yellow-100 text-yellow-600" },
      ACCEPTED: { label: "Chấp nhận", color: "bg-green-100 text-green-600" },
      REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-600" },
      INTERVIEW: { label: "Phỏng vấn", color: "bg-blue-100 text-blue-600" },
      CANCELLED: { label: "Đã hủy", color: "bg-gray-100 text-gray-600" }
    };
    return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  };

  const getJobTypeLabel = (jobType) => {
    const typeMap = {
      FULL_TIME: "Toàn thời gian",
      PART_TIME: "Bán thời gian",
      FREELANCE: "Freelance",
      INTERNSHIP: "Thực tập"
    };
    return typeMap[jobType] || jobType;
  };

  const formatSalary = (salary, salaryUnit) => {
    if (!salary) return "Thỏa thuận";
    const formattedSalary = parseFloat(salary).toLocaleString("vi-VN");
    return `${formattedSalary}đ/${salaryUnit || "tháng"}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleOpenRating = async () => {
    if (!app) return;

    let employerId = app.employerId;
    let employerName = app.companyName || app.employerName;

    // Nếu chưa có employerId, lấy từ job detail
    if (!employerId && app.jobId) {
      try {
        const jobResponse = await getJobDetailByIdForUser(app.jobId);
        const jobData = jobResponse?.data?.data || jobResponse?.data;
        if (jobData?.employer?.id) {
          employerId = jobData.employer.id;
        }
        if (!employerName && jobData?.employer?.fullName) {
          employerName = jobData.employer.fullName;
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin job:", error);
      }
    }

    setRatingModal({
      isOpen: true,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      employerId: employerId,
      employerName: employerName
    });
  };

  const handleRatingSuccess = () => {
    // Reload chi tiết sau khi đánh giá thành công
    loadApplicationDetail();
  };

  // Kiểm tra xem có thể đánh giá không
  const canRate = () => {
    if (!app) return false;
    return (
      app.statusJob === "CLOSED" &&
      (app.status === "ACCEPTED" || app.status === "REJECTED") &&
      app.jobId
    );
  };

  // Map jobStatus từ backend sang tiếng Việt
  const getJobStatusLabel = (statusJob) => {
    const statusMap = {
      PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-600" },
      APPROVED: { label: "Đã duyệt", color: "bg-green-100 text-green-600" },
      REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-600" },
      CLOSED: { label: "Đã đóng", color: "bg-gray-100 text-gray-600" },
      OPEN: { label: "Đang mở", color: "bg-blue-100 text-blue-600" }
    };
    return statusMap[statusJob] || { label: statusJob || "N/A", color: "bg-gray-100 text-gray-600" };
  };


  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4 mx-auto"></div>
          <p className="text-gray-500 font-medium">Đang tải chi tiết ứng tuyển...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <AlertCircle className="mx-auto text-slate-300 mb-4" size={64} />
          <p className="text-slate-600 mb-6 text-lg">Không tìm thấy đơn ứng tuyển</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(app.status);
  const schedule = `${app.workingDays ? formatWorkingDaysForDisplay(app.workingDays) : ""}${app.workingHours ? ` • ${app.workingHours}` : ""}`;

  return (
    <div className="w-full">
      {/* Nút quay lại */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        {/* Thẻ header với gradient */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex gap-6 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {app.jobTitle?.charAt(0).toUpperCase() || "C"}
              </div>
            </div>

            {/* Tiêu đề & Công ty */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{app.jobTitle || "Công việc"}</h1>
              <p className="text-lg text-slate-600 mb-4">{app.companyName || "Công ty"}</p>

              {/* Lưới thông tin */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {app.location && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin size={16} className="text-blue-600" />
                    <span>{app.location}</span>
                  </div>
                )}
                {app.salary && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <DollarSign size={16} className="text-emerald-600" />
                    <span>{formatSalary(app.salary, app.salaryUnit)}</span>
                  </div>
                )}
                {schedule && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock size={16} className="text-violet-600" />
                    <span>{schedule}</span>
                  </div>
                )}
                {app.jobType && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold">
                      {getJobTypeLabel(app.jobType)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Các huy hiệu trạng thái */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-200">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {app.statusJob && (() => {
              const jobStatusInfo = getJobStatusLabel(app.statusJob);
              return (
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${jobStatusInfo.color}`}>
                  {jobStatusInfo.label}
                </span>
              );
            })()}
            {app.appliedAt && (
              <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                <Calendar size={14} className="inline mr-1" /> {formatDate(app.appliedAt)}
              </span>
            )}
            {app.hasResume && (
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                <FileText size={14} /> {app.resumeFileName}
              </span>
            )}
          </div>
        </div>

        {/* Các phần nội dung */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nội dung chính - 2 cột */}
          <div className="lg:col-span-2 space-y-6">
            {app.description && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText size={18} className="text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Mô tả công việc</h2>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{app.description}</p>
              </div>
            )}

            {app.requirements && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <AlertCircle size={18} className="text-purple-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Yêu cầu</h2>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{app.requirements}</p>
              </div>
            )}

            {app.benefits && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Star size={18} className="text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Quyền lợi</h2>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{app.benefits}</p>
              </div>
            )}

            {app.coverLetter && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Thư xin việc của bạn</h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
                </div>
              </div>
            )}

            {app.status === "REJECTED" && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle size={18} className="text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold text-red-900">Lý do từ chối</h2>
                </div>
                <p className="text-red-800">
                  {app.rejectionReason || "Nhà tuyển dụng chưa cung cấp lý do cụ thể."}
                </p>
              </div>
            )}
          </div>

          {/* Thanh bên - 1 cột */}
          <div className="space-y-6">
            {/* Thẻ nhà tuyển dụng */}
            {app.employerName && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Nhà tuyển dụng</h3>
                <div className="flex items-start gap-4">
                  {app.employerAvatar && (
                    <img
                      src={app.employerAvatar}
                      alt={app.employerName}
                      className="w-14 h-14 rounded-full object-cover border border-slate-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/56";
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{app.employerName}</p>
                    {app.employerEmail && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                        <Mail size={14} />
                        <span className="truncate">{app.employerEmail}</span>
                      </div>
                    )}
                    {app.employerPhone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <Phone size={14} />
                        <span>{app.employerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Thẻ hành động */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Hành động</h3>
              <div className="space-y-2">
                <button
                  onClick={onBack}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
                >
                  ← Quay lại
                </button>
                {canRate() && (
                  <button
                    onClick={handleOpenRating}
                    className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Star size={16} className="fill-white" /> Đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, jobId: null, jobTitle: null, employerId: null, employerName: null })}
        jobTitle={ratingModal.jobTitle}
        jobId={ratingModal.jobId}
        employerId={ratingModal.employerId}
        employerName={ratingModal.employerName}
        onSuccess={handleRatingSuccess}
      />
    </div>
  );
}