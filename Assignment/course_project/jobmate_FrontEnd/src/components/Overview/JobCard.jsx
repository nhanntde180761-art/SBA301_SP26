import React, { useState } from "react";
import { MapPin, Clock, Star, Users, Briefcase, ArrowRight, DollarSign, CheckCircle, Flag } from "lucide-react";
import { Button } from "../Common";
import ReportModal from "../User/ReportModal";

export default function JobCard({ job, onDetail, onApply }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  // Chuẩn hóa dữ liệu từ API
  const title = job.title || "Vị trí tuyển dụng";
  const company = job.companyName || job.company || "Công ty tuyển dụng";
  const location = job.location || job.address || "Việt Nam";
  const salary = job.salary ? job.salary.toLocaleString('vi-VN') : "Thỏa thuận";
  const unit = job.salaryUnit ? `/${job.salaryUnit}` : "";
  const rating = job.averageRating || job.rating || 0;
  const applicants = job.applicationCount || job.applicants || 0;
  
  const initials = company.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="group relative bg-white rounded-[24px] p-6 border border-slate-100 hover:border-brand-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.12)] transition-all duration-500 flex flex-col h-full">
      {/* Thanh màu Gradient phía trên khi hover */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[24px]" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {/* Container Logo với nền gradient rực rỡ */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 border border-brand-100 flex items-center justify-center text-brand-600 font-black text-2xl group-hover:rotate-3 transition-transform duration-300 overflow-hidden shadow-inner flex-shrink-0">
            {job.companyLogo ? (
               <img 
                 src={job.companyLogo} 
                 alt={company} 
                 className="w-full h-full object-contain p-2.5" 
                 onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = initials; }}
               />
            ) : (
               initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-1" title={title}>
              {title}
            </h3>
            <div className="flex items-center gap-1.5 text-brand-600 font-bold text-sm min-w-0">
              <span className="hover:underline cursor-pointer truncate">{company}</span>
              {(job.isVerified !== false || job.tags?.includes("Đã xác minh")) && (
                <CheckCircle className="w-4 h-4 text-brand-500 fill-brand-50 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin phụ dạng thuốc (Pills) */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100 group-hover:bg-white transition-colors">
          <MapPin size={14} className="text-brand-500" />
          {location}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100 group-hover:bg-white transition-colors">
          <Clock size={14} className="text-brand-500" />
          {job.jobType || "Toàn thời gian"}
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="mt-auto">
        {/* Phần Mức lương và Lượt ứng tuyển */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Mức lương tháng</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-brand-600">
                {salary}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Ứng tuyển</span>
             <span className="text-sm font-black text-slate-700">{applicants} đã nộp</span>
          </div>
        </div>

        {/* Nút hành động sử dụng Component Button chung */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={(e) => { e.stopPropagation(); onDetail(); }}
            icon={ArrowRight}
            iconPosition="right"
          >
            Chi tiết
          </Button>
          <Button
            variant="primary"
            fullWidth
            className=" hover:bg-brand-900 shadow-lg shadow-slate-900/10 hover:shadow-brand-500/30"
            onClick={(e) => { e.stopPropagation(); onApply(); }}
          >
            Ứng tuyển ngay
          </Button>
        </div>
      </div>

      {/* Report button */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsReportOpen(true); }}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/0 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-200 border border-transparent hover:border-red-200"
        title="Báo cáo công việc này"
      >
        <Flag size={18} />
      </button>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="JOB"
        targetId={job.id || job.jobId}
        targetTitle={job.title}
      />
    </div>
  );
}
