import React from 'react'
import { MapPin, Clock, Star, MessageCircle, Eye, CheckCircle, XCircle } from 'lucide-react'
import { statusBadge, statusColor, initials, getStatusLabel, getJobTypeLabel, formatDateFull } from '../../utils/candidateUtils'

export default function CandidateCard({ 
  candidate, 
  onViewProfile, 
  onChat, 
  onAccept, 
  onReject, 
  onRate,
  canRate,
  isUpdating 
}) {
  const skillsList = candidate.skills ? candidate.skills.split(',').map(s => s.trim()).filter(Boolean) : []
  const matchPercentage = candidate.matchScore || 0

  return (
    <div className={`${statusColor(candidate.status)} app-card p-5`}>
      <div className="flex flex-col items-start gap-4 xl:flex-row">
        {/* Left: Avatar and Info */}
        <div className="flex items-start gap-4 flex-1">
          {candidate.avatarUrl ? (
            <img
              src={candidate.avatarUrl}
              alt={candidate.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150"
                e.target.onerror = null
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 font-semibold text-xl border-2 border-slate-200">
              {initials(candidate.name)}
            </div>
          )}

          <div className="flex-1">
            {/* Name and Status */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{candidate.name}</h3>
                {candidate.appliedAt && (
                  <p className="text-sm text-slate-600">Ngày nộp: {formatDateFull(candidate.appliedAt)}</p>
                )}
              </div>
              <div className={`app-badge inline-flex items-center ${statusBadge(candidate.status)}`}>
                {getStatusLabel(candidate.status)}
              </div>
            </div>

            {/* Rating, Location, Job Type */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-3">
              <div className="app-chip">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{candidate.trustScore ? candidate.trustScore.toFixed(1) : '0.0'}</span>
              </div>
              {candidate.address && (
                <div className="app-chip">
                  <MapPin size={16} className="text-blue-500" />
                  <span>{candidate.address}</span>
                </div>
              )}
              {candidate.preferredJobType && (
                <div className="app-chip">
                  <Clock size={16} className="text-violet-500" />
                  <span>{getJobTypeLabel(candidate.preferredJobType)}</span>
                </div>
              )}
            </div>

            {/* Skills Tags */}
            {skillsList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skillsList.map((skill, i) => (
                  <span key={i} className="app-badge bg-emerald-100 text-emerald-700">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Progress Bars */}
            {matchPercentage > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    style={{ width: `${matchPercentage}%` }}
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 min-w-[80px] text-right">
                  {matchPercentage.toFixed(0)}% phù hợp
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Action Buttons (Vertical) */}
        <div className="flex w-full flex-wrap gap-2 xl:ml-4 xl:w-auto xl:flex-col">
          <button
            onClick={() => onViewProfile(candidate.applicationId)}
            className="app-btn-secondary whitespace-nowrap"
          >
            <Eye size={16} /> Xem hồ sơ
          </button>
          <button
            onClick={() => onChat(candidate.applicantId)}
            className="app-btn-soft whitespace-nowrap"
          >
            <MessageCircle size={16} /> Nhắn tin
          </button>
          {candidate.status === 'PENDING' && (
            <>
              <button
                onClick={() => onAccept(candidate.applicationId)}
                disabled={isUpdating}
                className="app-btn whitespace-nowrap bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={16} /> Chấp nhận
              </button>
              <button
                onClick={() => onReject(candidate.applicationId)}
                disabled={isUpdating}
                className="app-btn whitespace-nowrap bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle size={16} /> Từ chối
              </button>
            </>
          )}
          {canRate && (
            <button
              onClick={() => onRate(candidate)}
              className="app-btn-warning whitespace-nowrap"
              title="Đánh giá ứng viên"
            >
              <Star size={16} className="fill-white text-white" /> Đánh giá
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

