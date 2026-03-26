import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getMyApplications, cancelApplication } from "../../services/applicationService";
import { createConversation } from "../../services/chatService";
import { getJobDetailByIdForUser } from "../../services/jobService";
import { formatWorkingDaysForDisplay } from "../../utils/scheduleUtils";
import RatingModal from "../../components/User/RatingModal";
import ApplicationCard from "../../components/User/ApplicationCard";
import { showError, showSuccess, showWarning } from "../../utils/toast";

export default function Application({ onViewDetail, onStartChat }) {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
    totalElements: 0
  });
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    jobId: null,
    jobTitle: null,
    employerId: null,
    employerName: null
  });

  useEffect(() => {
    loadApplications();
  }, []);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const loadApplications = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const response = await getMyApplications(page, size);
      const data = response?.data?.data;

      if (data) {
        // Map dữ liệu từ API response
        // API trả về applicationId, cần map thành id để component sử dụng
        const mappedApplications = (data.data || []).map((app) => ({
          ...app,
          id: app.applicationId || app.id, // Ưu tiên applicationId từ API
        }));
        setApplications(mappedApplications);
        setFilteredApplications(mappedApplications);
        setPagination({
          currentPage: data.currentPage || 0,
          totalPages: data.totalPages || 0,
          pageSize: data.pageSize || 10,
          totalElements: data.totalElements || 0
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách ứng tuyển:", error);
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Map status từ backend sang tiếng Việt
  const getStatusLabel = (status) => {
    const statusMap = {
      PENDING: { label: "Đang xem xét", color: "bg-yellow-100 text-yellow-600" },
      ACCEPTED: { label: "Chấp nhận", color: "bg-green-100 text-green-600" },
      REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-600" },
      CANCELLED: { label: "Đã hủy", color: "bg-gray-100 text-gray-600" }
    };
    return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-600" };
  };

  // Map jobStatus từ backend sang tiếng Việt
  const getJobStatusLabel = (statusJob) => {
    const statusMap = {
      PENDING: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-600" },
      APPROVED: { label: "Đang mở", color: "bg-green-100 text-green-600" },
      REJECTED: { label: "Từ chối", color: "bg-red-100 text-red-600" },
      CLOSED: { label: "Đã đóng", color: "bg-gray-100 text-gray-600" },
      
    };
    return statusMap[statusJob] || { label: statusJob || "N/A", color: "bg-gray-100 text-gray-600" };
  };

  // Map jobType từ backend sang tiếng Việt
  const getJobTypeLabel = (jobType) => {
    const typeMap = {
      FULL_TIME: "Toàn thời gian",
      PART_TIME: "Bán thời gian",
      FREELANCE: "Freelance",
      INTERNSHIP: "Thực tập"
    };
    return typeMap[jobType] || jobType;
  };

  // Format salary
  const formatSalary = (salary, salaryUnit) => {
    if (!salary) return "Thỏa thuận";
    const formattedSalary = parseFloat(salary).toLocaleString("vi-VN");
    return `${formattedSalary}đ/${salaryUnit || "tháng"}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleChat = async (employerId) => {
    if (!employerId) {
      console.warn("Không có employerId để tạo conversation");
      return;
    }

    try {
      await createConversation({ participantIds: [employerId] });
      if (onStartChat) {
        onStartChat();
      }
    } catch (error) {
      console.error("Lỗi khi tạo conversation:", error);
      showWarning(error?.response?.data?.message || "Không thể tạo cuộc trò chuyện. Vui lòng thử lại.");
    }
  };

  const handleCancelApplication = async (applicationId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn ứng tuyển này không?")) {
      return;
    }

    try {
      await cancelApplication(applicationId);
      // Reload danh sách
      await loadApplications(pagination.currentPage, pagination.pageSize);
      setOpenMenuId(null);
      showSuccess("Đã hủy đơn ứng tuyển thành công");
    } catch (error) {
      console.error("Lỗi khi hủy đơn ứng tuyển:", error);
      showError(error?.response?.data?.message || "Không thể hủy đơn ứng tuyển. Vui lòng thử lại.");
    }
  };

  const handleOpenRating = async (app) => {
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
    // Reload danh sách sau khi đánh giá thành công
    loadApplications(pagination.currentPage, pagination.pageSize);
  };

  // Kiểm tra xem có thể đánh giá không
  const canRate = (app) => {
    const canRateResult = (
      app.statusJob === "CLOSED" &&
      (app.status === "ACCEPTED" || app.status === "REJECTED") &&
      app.jobId
    );
    
    return canRateResult;
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = applications.filter(
      (app) =>
        app.jobTitle?.toLowerCase().includes(value) ||
        app.companyName?.toLowerCase().includes(value)
    );
    setFilteredApplications(filtered);
  };

  const stats = [
    {
      id: 1,
      label: "Tổng số",
      value: pagination.totalElements,
      icon: <FileText className="text-gray-500" size={22} />,
    },
    {
      id: 2,
      label: "Đang xem xét",
      value: applications.filter((app) => app.status === "PENDING").length,
      icon: <AlertCircle className="text-yellow-500" size={22} />,
    },

    {
      id: 3,
      label: "Chấp nhận",
      value: applications.filter((app) => app.status === "ACCEPTED").length,
      icon: <CheckCircle className="text-green-500" size={22} />,
    },
    {
      id: 4,
      label: "Từ chối",
      value: applications.filter((app) => app.status === "REJECTED").length,
      icon: <XCircle className="text-red-500" size={22} />,
    },
  ];

  return (
    <div className="w-full">
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Ứng tuyển của tôi</h1>
          <p className="text-blue-100 text-lg">Theo dõi trạng thái các đơn ứng tuyển của bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-4 flex items-center gap-3">
            <span className="text-2xl text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm công việc hoặc công ty..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 outline-none text-slate-700 placeholder-slate-400 text-lg"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 text-center py-16">
              <FileText className="mx-auto text-slate-300 mb-4" size={64} />
              <p className="text-slate-700 font-semibold text-lg">Chưa có đơn ứng tuyển nào</p>
              <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">Hãy tìm kiếm và ứng tuyển các công việc phù hợp với bạn để bắt đầu hành trình tìm việc của bạn</p>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const statusInfo = getStatusLabel(app.status);
              const jobStatusInfo = app.statusJob ? getJobStatusLabel(app.statusJob) : null;
              const schedule = `${app.workingDays ? formatWorkingDaysForDisplay(app.workingDays) : ""}${app.workingHours ? ` • ${app.workingHours}` : ""}`;

              return (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  statusInfo={statusInfo}
                  jobStatusInfo={jobStatusInfo}
                  schedule={schedule}
                  openMenuId={openMenuId}
                  onToggleMenu={(id) => setOpenMenuId(openMenuId === id ? null : id)}
                  menuRef={(el) => (menuRefs.current[app.id] = el)}
                  onViewDetail={onViewDetail}
                  onChat={handleChat}
                  onOpenRating={handleOpenRating}
                  onCancelApplication={handleCancelApplication}
                  canRate={canRate(app)}
                  formatSalary={formatSalary}
                  formatDate={formatDate}
                  getJobTypeLabel={getJobTypeLabel}
                />
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => loadApplications(pagination.currentPage - 1, pagination.pageSize)}
              disabled={pagination.currentPage === 0}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              ← Trước
            </button>
            <div className="bg-slate-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-slate-600">
                <span className="font-semibold">{pagination.currentPage + 1}</span>
                <span className="text-slate-400"> / </span>
                <span>{pagination.totalPages}</span>
              </span>
            </div>
            <button
              onClick={() => loadApplications(pagination.currentPage + 1, pagination.pageSize)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              Sau →
            </button>
          </div>
        )}

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
    </div>
  );
}
