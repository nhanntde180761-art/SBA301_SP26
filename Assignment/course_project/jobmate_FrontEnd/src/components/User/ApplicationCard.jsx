import React from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  Eye,
  MessageSquare,
  MoreVertical,
  Trash2,
  Star,
} from "lucide-react";

export default function ApplicationCard({
  app,
  statusInfo,
  jobStatusInfo,
  schedule,
  openMenuId,
  onToggleMenu,
  menuRef,
  onViewDetail,
  onChat,
  onOpenRating,
  onCancelApplication,
  canRate,
  formatSalary,
  formatDate,
  getJobTypeLabel,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all overflow-hidden group">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="p-5 sm:p-6">
        {/* Main content */}
        <div className="flex flex-col gap-4">
          {/* Header: Avatar + Title */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 border border-indigo-200">
                {app.jobTitle?.charAt(0).toUpperCase() || "J"}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{app.jobTitle || "Công việc"}</h3>
              <p className="text-sm text-slate-600 line-clamp-1 mt-0.5">{app.companyName || "Công ty"}</p>

              {/* Info chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {app.location && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    <MapPin size={13} /> {app.location}
                  </span>
                )}
                {app.salary && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                    <DollarSign size={13} /> {formatSalary(app.salary, app.salaryUnit)}
                  </span>
                )}
                {schedule && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">
                    <Clock size={13} /> {schedule}
                  </span>
                )}
              </div>
            </div>

            {/* Menu button */}
            <div className="flex-shrink-0 relative" ref={menuRef}>
              <button
                onClick={() => onToggleMenu(app.id)}
                className={`p-2 rounded-lg border transition ${
                  openMenuId === app.id
                    ? "bg-slate-100 border-slate-300 text-slate-700"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <MoreVertical size={16} />
              </button>

              {openMenuId === app.id && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                  <div className="p-1.5">
                    {app.status === "PENDING" && (
                      <button
                        onClick={() => onCancelApplication(app.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                      >
                        <Trash2 size={14} /> Hủy ứng tuyển
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {jobStatusInfo && (
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${jobStatusInfo.color}`}>
                {jobStatusInfo.label}
              </span>
            )}
            {app.jobType && (
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                {getJobTypeLabel(app.jobType)}
              </span>
            )}
            {app.appliedAt && (
              <span className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-full text-xs font-medium">
                {formatDate(app.appliedAt)}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => onViewDetail(app.id)}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              <Eye size={16} /> Chi tiết
            </button>

            {app.employerId && (
              <button
                onClick={() => onChat(app.employerId)}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-200 transition flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Nhắn tin
              </button>
            )}

            {canRate && (
              <button
                onClick={() => onOpenRating(app)}
                className="flex-1 sm:flex-none px-4 py-2 bg-amber-50 text-amber-700 rounded-lg font-medium text-sm hover:bg-amber-100 transition flex items-center justify-center gap-2 border border-amber-200"
              >
                <Star size={16} className="fill-amber-600 text-amber-600" /> Đánh giá
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
