import React, { useState, useEffect } from "react";
import {
  Mail, MapPin, Calendar, CheckCircle,
  ClipboardList, Percent, Camera,
} from "lucide-react";
import InfoTab from "./ProfileTabs/InfoTab";
import TwoFactorTab from "./ProfileTabs/TwoFactorTab";
import VerifyCCCDTab from "./ProfileTabs/VerifyCCCDTab";
import ReviewsTab from "./ProfileTabs/ReviewsTab";
import CareerInfoTab from "./ProfileTabs/CareerInfoTab";
import LocationPickerModal from "../../components/Common/LocationPickerModal";
import { Button, Skeleton } from "../../components/Common";
import { uploadFile } from "../../services/uploadFileService";
import { getUserInfo, getUserStats, updateUserInfo, updateTwoFactorStatus, upgradeRole } from "../../services/userService";

import { showSuccess, showError } from "../../utils/toast";
import VerifyCCCD from "./VerifyCCCD.jsx";


const HERE_API_KEY = (typeof import.meta !== "undefined" && import.meta.env?.VITE_HERE_API_KEY) || "";

const extractAvatarUrl = (data = {}) =>
  data.avatarUrl || data.avatar || data.profilePicture || data.photoUrl || null;

const Profile = ({ onAvatarChange, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUpgradeSubmitting, setIsUpgradeSubmitting] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [userStatsLoading, setUserStatsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserInfo();
        const data = res?.data?.data || res?.data;
        if (!data) return;
        const normalizedAvatarUrl = extractAvatarUrl(data);
        setProfile({ ...data, avatarUrl: normalizedAvatarUrl });
        setTwoFactorEnabled(Boolean(data.twoFaEnabled || data.twoFactorEnabled));
        setIsEmployer(data.roles?.some(r => r.name?.toUpperCase() === "EMPLOYER"));

        if (normalizedAvatarUrl && onAvatarChange) onAvatarChange(normalizedAvatarUrl);
        if (onProfileUpdate) onProfileUpdate({ ...data, avatarUrl: normalizedAvatarUrl });
      } catch  {
        showError("Không thể tải thông tin");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile || isEmployer || userStats !== null) return;
    const fetchStats = async () => {
      try {
        setUserStatsLoading(true);
        const res = await getUserStats();
        setUserStats(res?.data?.data || null);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setUserStatsLoading(false);
      }
    };
    fetchStats();
  }, [profile, isEmployer]);

  const handleSave = async () => {
    if (!profile.fullName?.trim()) return showError("Họ tên không được để trống");
    try {
      const res = await updateUserInfo(profile);
      const updated = res?.data?.data || profile;
      setProfile(prev => ({ ...prev, ...updated, avatarUrl: extractAvatarUrl(updated) }));
      setIsEditing(false);
      showSuccess("Đã lưu thay đổi");
      if (onProfileUpdate) onProfileUpdate(updated);
    } catch (error) {
      showError("Cập nhật thất bại");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
        const url = await uploadFile(file, "AVATAR");
        const res = await updateUserInfo({ ...profile, avatarUrl: url });
        setProfile(prev => ({ ...prev, avatarUrl: url }));
        if (onAvatarChange) onAvatarChange(url);
        showSuccess("Cập nhật ảnh thành công");
    } catch  {
        showError("Lỗi upload ảnh");
    } finally {
        setAvatarLoading(false);
    }
  };

  const handleUpgradeRequest = async () => {
    try {
      setIsUpgradeSubmitting(true);
      await upgradeRole(profile.id);
      showSuccess("Yêu cầu nâng cấp thành công. Vui lòng đợi phê duyệt.");
      setIsUpgradeModalOpen(false);
    } catch  {
      showError("Gửi yêu cầu thất bại");
    } finally {
      setIsUpgradeSubmitting(false);
    }
  };

  if (!profile) return <div className="p-8"><Skeleton className="h-96 w-full rounded-3xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary-900 tracking-tight">Hồ sơ cá nhân</h1>
          <p className="text-primary-500 font-medium">Quản lý thông tin và bảo mật tài khoản của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEmployer && (
            <Button variant="secondary" onClick={() => setIsUpgradeModalOpen(true)}>
              Nâng cấp nhà tuyển dụng
            </Button>
          )}
          <Button
            variant={isEditing ? "success" : "primary"}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={["2fa", "verify", "reviews"].includes(activeTab)}
          >
            {isEditing ? "Lưu thay đổi" : "Chỉnh sửa hồ sơ"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin tổng quan */}
        <div className="space-y-6">
          <div className="app-card p-8 text-center">
            <div className="relative inline-block mb-4">
              <div className={`w-28 h-28 rounded-full border-4 border-white shadow-soft overflow-hidden bg-brand-50 ${avatarLoading ? 'opacity-50' : ''}`}>
                <img src={profile.avatarUrl || "https://via.placeholder.com/150"} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <label
                title="Tải ảnh đại diện"
                className="absolute bottom-0 right-0 p-2 bg-brand-600 text-white rounded-full border-2 border-white shadow-premium cursor-pointer hover:bg-brand-700 focus-within:ring-2 focus-within:ring-brand-300 focus-within:ring-offset-2 transition-all active:scale-90"
              >
                <Camera size={16} />
                <input type="file" className="hidden" onChange={handleAvatarUpload} disabled={isEditing} />
              </label>
            </div>

            <h2 className="text-xl font-black text-primary-900 mb-1">{profile.fullName}</h2>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                profile.verificationStatus === "VERIFIED" ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20' : 'bg-primary-50 text-primary-400 border-primary-100'
              }`}>
                {profile.verificationStatus === "VERIFIED" ? 'Đã xác thực' : 'Chưa xác thực'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100">
                Uy tín: {Number(profile.trustScore || 0).toFixed(1)}
              </span>
            </div>

            <div className="space-y-3 text-left border-t border-primary-50 pt-4 mt-4">
              <div className="flex items-center gap-3 text-sm text-primary-600 font-medium">
                <Mail size={16} className="text-brand-500" /> <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-600 font-medium">
                <MapPin size={16} className="text-brand-500" /> <span className="truncate">{profile.address || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-600 font-medium">
                <Calendar size={16} className="text-brand-500" /> Tham gia: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          {!isEmployer && (
            <div className="app-card p-6">
              <h3 className="text-sm font-black text-primary-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ClipboardList size={18} className="text-brand-600" /> Thống kê
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Ứng tuyển", val: userStats?.totalApplications || 0, icon: ClipboardList, color: "text-brand-600" },
                  { label: "Hoàn thành", val: userStats?.completedApplications || 0, icon: CheckCircle, color: "text-accent-emerald" },
                  { label: "Tỷ lệ", val: `${(Number(userStats?.completionRate || 0) * 1).toFixed(1)}%`, icon: Percent, color: "text-accent-amber" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-100 rounded-xl border border-primary-50">
                    <span className="text-xs font-bold text-primary-500 flex items-center gap-2">
                      <stat.icon size={14} /> {stat.label}
                    </span>
                    <span className={`text-sm font-black ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột phải: Tabs nội dung */}
        <div className="lg:col-span-2 space-y-6">
          <div className="app-card p-1.5 flex flex-wrap gap-1 bg-surface-200 border-none" role="tablist" aria-label="Profile tabs">
            {[
              { id: "info", label: "Cá nhân" },
              ...(!isEmployer ? [{ id: "career", label: "Việc làm" }] : []),
              { id: "2fa", label: "Bảo mật" },
              { id: "verify", label: "Xác minh" },
              { id: "reviews", label: "Đánh giá" }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`profile-tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`profile-tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[80px] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
                  activeTab === tab.id
                    ? "bg-white text-brand-700 shadow-soft ring-1 ring-brand-200 border border-brand-100 border-b-2 border-b-brand-600"
                    : "text-primary-500 hover:text-primary-900 hover:bg-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="app-card p-8 min-h-[500px]"
            role="tabpanel"
            id={`profile-tabpanel-${activeTab}`}
            aria-labelledby={`profile-tab-${activeTab}`}
          >
            <div className="animate-in slide-in-from-bottom-2 duration-300">
              {activeTab === "info" && (
                <InfoTab profile={profile} isEditing={isEditing} handleChange={(e) => setProfile({...profile, [e.target.name]: e.target.value})} onAddressPickerOpen={() => setIsLocationModalOpen(true)} />
              )}
              {activeTab === "career" && (
                <CareerInfoTab profile={profile} isEditing={isEditing} handleChange={(e) => setProfile({...profile, [e.target.name]: e.target.value})} />
              )}
              {activeTab === "2fa" && (
                <TwoFactorTab twoFactorEnabled={twoFactorEnabled} isUpdating={twoFactorLoading} onToggle={(state) => { setTwoFactorLoading(true); updateTwoFactorStatus(state).then(() => { setTwoFactorEnabled(state); showSuccess("Đã cập nhật"); }).finally(() => setTwoFactorLoading(false)); }} />
              )}
              {activeTab === "verify" && (
                <VerifyCCCD verificationStatus={profile.verificationStatus} rejectionReason={profile.verificationReason} onVerifySuccess={() => getUserInfo().then(res => setProfile(res.data.data))} />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab userId={profile.id} />
              )}
            </div>
          </div>
        </div>
      </div>

      <LocationPickerModal
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        defaultQuery={profile?.address || ""}
        onSelect={(addr, lat, lon) => { setProfile({...profile, address: addr, latitude: lat, longitude: lon}); setIsLocationModalOpen(false); }}
        hereApiKey={HERE_API_KEY}
      />

      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="app-card max-w-md w-full p-8 space-y-6 animate-in zoom-in-95 duration-200 shadow-premium">
            <h2 className="text-xl font-black text-primary-900">Nâng cấp nhà tuyển dụng</h2>
            <p className="text-sm text-primary-500 font-medium">Đảm bảo bạn đã hoàn tất xác minh CCCD và cập nhật đầy đủ thông tin trước khi gửi yêu cầu.</p>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" fullWidth onClick={() => setIsUpgradeModalOpen(false)}>Hủy bỏ</Button>
              <Button variant="primary" fullWidth onClick={handleUpgradeRequest} isLoading={isUpgradeSubmitting}>Gửi yêu cầu</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
