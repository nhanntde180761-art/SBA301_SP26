import React, { useEffect, useState, lazy, Suspense } from "react";
import {
    ArrowRight,
    Award,
    Briefcase,
    CheckCircle,
    DollarSign,
    Lightbulb,
    MessageSquare,
    TrendingUp,
    Clock,
    MapPin,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { getMyInvitations, acceptInvitation, rejectInvitation } from "../../services/invitationService";
import { getRecommendedJobsByProfile } from "../../services/recommendService";
import { getUserInfo } from "../../services/userService";
import { showError, showSuccess } from "../../utils/toast";
import { SALARY_UNIT_LABELS } from "../../constants/salaryUnits";
import { formatWorkingDaysForDisplay } from "../../utils/scheduleUtils";
import Button from "../../components/Common/Button.jsx";

const JobListDetail = lazy(() => import("./JobListDetail"));

const onboardingSteps = [
    {
        id: 1,
        title: "Hoàn thiện hồ sơ",
        description: "Thêm ảnh, kỹ năng, kinh nghiệm để thu hút nhà tuyển dụng",
        icon: Award,
        completed: true,
    },
    {
        id: 2,
        title: "Tìm công việc",
        description: "Khám phá hàng trăm cơ hội việc làm part-time phù hợp",
        icon: Briefcase,
        completed: false,
    },
    {
        id: 3,
        title: "Ứng tuyển",
        description: "Gửi CV và thư xin việc chỉ với vài cú click",
        icon: MessageSquare,
        completed: false,
    },
    {
        id: 4,
        title: "Chờ phản hồi",
        description: "Theo dõi trạng thái và nhận lịch phỏng vấn",
        icon: TrendingUp,
        completed: false,
    },
];

const getStatusStyles = (status) => {
    switch (status) {
        case "pending": return "bg-amber-50 text-amber-700 border-amber-100";
        case "interview": return "bg-blue-50 text-blue-700 border-blue-100";
        case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-100";
        case "rejected": return "bg-rose-50 text-rose-700 border-rose-100";
        default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
};

const getStatusText = (status) => {
    switch (status) {
        case "pending": return "Đang chờ";
        case "interview": return "Phỏng vấn";
        case "accepted": return "Được nhận";
        case "rejected": return "Từ chối";
        default: return status;
    }
};

export default function Dashboard({ onTabChange }) {
    const [invitations, setInvitations] = useState([]);
    const [loadingInvitations, setLoadingInvitations] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loadingRecommendedJobs, setLoadingRecommendedJobs] = useState(false);
    const [hasProfileInfo, setHasProfileInfo] = useState(false);
    const [detailJobId, setDetailJobId] = useState(null);
    const [showJobDetail, setShowJobDetail] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // Dữ liệu giả cho demo (trong thực tế nên lấy từ API)
    const mockApplications = [
        { id: 1, company: "Tech Startup ABC", position: "Frontend Developer Intern", status: "pending", appliedDate: "15/05/2024", salary: "8-12 triệu" },
        { id: 2, company: "Marketing Agency XYZ", position: "Content Creator", status: "interview", appliedDate: "10/05/2024", salary: "6-8 triệu" },
    ];

    useEffect(() => {
        const fetchInvitations = async () => {
            setLoadingInvitations(true);
            try {
                const response = await getMyInvitations();
                setInvitations(response?.data?.data || []);
            } catch {
                console.warn("Không thể tải lời mời");
            } finally {
                setLoadingInvitations(false);
            }
        };
        fetchInvitations();
    }, []);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const res = await getUserInfo();
                const profile = res?.data?.data || res?.data || {};
                setUserInfo(profile);

                const hasJobInfo = Boolean(
                    profile.preferredJobType ||
                    profile.availableDays ||
                    profile.availableTime ||
                    profile.preferredMinSalary
                );
                setHasProfileInfo(hasJobInfo);

                if (hasJobInfo) {
                    await loadRecommendedJobs();
                }
            } catch (err) {
                console.error("Lỗi khi tải thông tin người dùng:", err);
            }
        };
        loadUserProfile();
    }, []);

    const loadRecommendedJobs = async () => {
        setLoadingRecommendedJobs(true);
        try {
            const res = await getRecommendedJobsByProfile();
            const payload = res?.data?.data;
            const nested = payload?.data;

            let jobs = [];
            if (Array.isArray(nested)) {
                jobs = nested.flatMap((item) =>
                    Array.isArray(item) ? item.filter(Boolean) : [item]
                );
            }
            setRecommendedJobs(jobs);
        } catch {
            setRecommendedJobs([]);
        } finally {
            setLoadingRecommendedJobs(false);
        }
    };

    const formatJobSalary = (salary, unit) => {
        if (!salary) return "Thỏa thuận";
        const formatted = new Intl.NumberFormat("vi-VN").format(salary) + "đ";
        const unitLabel = unit ? (SALARY_UNIT_LABELS[unit] || unit) : "";
        return unitLabel ? `${formatted} / ${unitLabel}` : formatted;
    };

    const handleInvitationAction = async (invitationId, action) => {
        const actionKey = `${invitationId}-${action}`;
        setActionLoading(actionKey);
        try {
            const apiCall = action === "accept" ? acceptInvitation : rejectInvitation;
            const response = await apiCall(invitationId);
            const updatedInvitation = response?.data?.data;

            setInvitations((prev) =>
                prev.map((inv) =>
                    inv.id === invitationId
                        ? { ...inv, status: updatedInvitation?.status || (action === "accept" ? "ACCEPTED" : "REJECTED") }
                        : inv
                )
            );
            showSuccess(action === "accept" ? "Đã chấp nhận lời mời" : "Đã từ chối lời mời");
        } catch {
            showError("Không thể xử lý lời mời");
        } finally {
            setActionLoading(null);
        }
    };

    const handleOnboardingStepClick = (stepId) => {
        if (stepId === 1) onTabChange('profile');
        else if (stepId === 2 || stepId === 3) onTabChange('find-jobs');
        else if (stepId === 4) onTabChange('applications');
    };

    {/* ===== JOB CARD ===== */}
    const renderJobCard = (job) => (
        <div key={job.id} className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                        <Briefcase className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{job.companyName || "Công ty ẩn danh"}</p>
                    </div>
                </div>
                {job.score && (
                    <div className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shrink-0">
                        <Sparkles className="h-3 w-3" />
                        {Math.round(job.score)}% PHÙ HỢP
                    </div>
                )}
            </div>

            <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-medium">{formatJobSalary(job.salary, job.salaryUnit)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>{job.distance ? `Cách đây ${job.distance.toFixed(1)} km` : "Vị trí linh hoạt"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="line-clamp-1">{job.scheduleDays ? formatWorkingDaysForDisplay(job.scheduleDays) : "Thời gian thỏa thuận"}</span>
                </div>
            </div>

            {/* Bỏ Button component, dùng button thuần để tránh !important */}
            <button
                onClick={() => { setDetailJobId(job.id); setShowJobDetail(true); }}
                className="w-full py-2.5 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-semibold
                       hover:bg-indigo-600 hover:text-white hover:border-indigo-600
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
                Xem chi tiết <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 transition-opacity duration-300 pb-12">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-indigo-800 border border-indigo-500 px-3 py-1 rounded-full text-xs font-medium mb-6">
                        <Sparkles className="h-3 w-3 text-amber-300" />
                        <span>Chào mừng quay trở lại, {userInfo?.fullName || "Bạn"}!</span>
                    </div>
                    {/* ===== HERO H1 - fix text-accent-amber ===== */}
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                        Tìm kiếm công việc <br />
                        <span className="text-amber-400">phù hợp nhất</span> với bạn
                    </h1>
                    <p className="text-indigo-100 text-lg mb-8 opacity-90 max-w-lg">
                        Khám phá hàng ngàn cơ hội việc làm part-time và bắt đầu hành trình sự nghiệp ngay hôm nay.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            onClick={() => onTabChange('find-jobs')}
                            variant="secondary"
                            className="bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                        >
                            Khám phá ngay <ArrowRight className="h-5 w-5" />
                        </Button>
                        <Button
                            onClick={() => onTabChange('profile')}
                            variant="ghost"
                            className="bg-indigo-700 text-white border border-indigo-400 hover:bg-indigo-600"
                        >
                            Hồ sơ của tôi
                        </Button>
                    </div>
                </div>
                
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:block opacity-20">
                    <Briefcase className="w-64 h-64 text-white" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                Lộ trình sự nghiệp
                            </h2>
                            <span className="text-sm font-medium text-gray-500">Tiến độ 50%</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {onboardingSteps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <button
                                        key={step.id}
                                        type="button"
                                        className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                                            step.completed
                                                ? "bg-emerald-50/30 border-emerald-100"
                                                : "bg-white border-gray-100 hover:border-indigo-200 hover:shadow-md cursor-pointer"
                                            }`}
                                        onClick={() => handleOnboardingStepClick(step.id)}
                                        aria-label={`Bước ${step.id}: ${step.title}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl shrink-0 ${step.completed ? "bg-emerald-100 text-emerald-600" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-bold text-gray-900 text-sm truncate">{step.title}</h3>
                                                    {step.completed && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                                Gợi ý cho riêng bạn
                            </h2>
                            <button onClick={() => onTabChange('find-jobs')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1">
                                Xem tất cả <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {!hasProfileInfo ? (
                            <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center">
                                <div className="bg-amber-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lightbulb className="h-8 w-8 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Nhận gợi ý chính xác hơn</h3>
                                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                    Cập nhật sở thích và kỹ năng để hệ thống AI của JobMate tìm kiếm những công việc phù hợp nhất với bạn.
                                </p>
                                <Button
                                    onClick={() => onTabChange('profile')}
                                    variant="primary"
                                    className="inline-flex items-center gap-2"
                                >
                                    Cập nhật hồ sơ <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : loadingRecommendedJobs ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-48 animate-pulse" />
                                ))}
                            </div>
                        ) : recommendedJobs.length === 0 ? (
                            <div className="bg-gray-50 rounded-3xl p-10 text-center border border-gray-100">
                                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">Chưa có gợi ý phù hợp. Hãy thử thay đổi tiêu chí tìm kiếm.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {recommendedJobs.slice(0, 4).map(renderJobCard)}
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Lời mời làm việc</h2>
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-1 rounded-md">
                                {invitations.filter(i => i.status === "PENDING").length} MỚI
                            </span>
                        </div>

                        {loadingInvitations ? (
                            <div className="space-y-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : invitations.length === 0 ? (
                            <div className="py-10 text-center">
                                <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <MessageSquare className="h-8 w-8 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500">Chưa có lời mời nào</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {invitations.map((inv) => (
                                    <div key={inv.id} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                                                <Briefcase className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-gray-900 truncate">{inv.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5 max-h-10 overflow-hidden">{inv.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                                {new Date(inv.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                            {inv.status === "PENDING" ? (
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleInvitationAction(inv.id, "reject")}
                                                        disabled={actionLoading === `${inv.id}-reject`}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:bg-gray-200"
                                                    >
                                                        Bỏ qua
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleInvitationAction(inv.id, "accept")}
                                                        disabled={actionLoading === `${inv.id}-accept`}
                                                        variant="primary"
                                                        size="sm"
                                                    >
                                                        Chấp nhận
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                                    inv.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                    {inv.status === "ACCEPTED" ? "Đã nhận" : "Đã từ chối"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Ứng tuyển gần đây</h2>
                            <button onClick={() => onTabChange('applications')} className="text-xs font-bold text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 py-0.5">
                                Xem tất cả
                            </button>
                        </div>
                        <div className="space-y-4">
                            {mockApplications.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
                                            {app.company.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{app.position}</h4>
                                            <p className="text-[11px] text-gray-500">{app.company} · {app.appliedDate}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getStatusStyles(app.status)}`}>
                                        {getStatusText(app.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ===== MẸO THÀNH CÔNG - fix conflict + icon màu ===== */}
                    <section className="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="bg-indigo-500/20 h-10 w-10 rounded-xl flex items-center justify-center mb-4">
                                <Lightbulb className="h-6 w-6 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">Mẹo thành công</h3>
                            <ul className="space-y-3 text-sm text-indigo-200">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                    Cập nhật hồ sơ giúp tăng 80% cơ hội được nhận lời mời.
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                    Ứng tuyển các công việc có tỉ lệ phù hợp cao ({">"}85%).
                                </li>
                            </ul>
                        </div>
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    </section>
                </div>
            </div>

            {/* Modal chi tiết công việc */}
            {showJobDetail && detailJobId && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => {
                    setShowJobDetail(false);
                    setDetailJobId(null);
                }}>
                    <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <Suspense fallback={<div className="p-6 text-sm text-gray-500">Đang tải chi tiết công việc...</div>}>
                            <JobListDetail
                                id={detailJobId}
                                variant="modal"
                                onStartChat={() => onTabChange('messages')}
                                onBack={() => {
                                    setShowJobDetail(false);
                                    setDetailJobId(null);
                                }}
                            />
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
    );
}
