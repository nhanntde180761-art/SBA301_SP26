import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/Overview/JobCard";
import StepsSection from "../../components/Overview/StepsSection";
import Header from "../../components/Overview/Header";
import Footer from "../../components/Overview/Footer";
import Button from "../../components/Common/Button";
import { searchAvailableJobs } from "../../services/jobService";
import { SALARY_UNIT_LABELS } from "../../constants/salaryUnits";
import { getToken } from "../../services/localStorageService";

export default function Overview() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const formatSalary = React.useCallback((salary, unit) => {
    if (unit === "NEGOTIABLE" || !salary) return "Thỏa thuận";
    const formatted = Number(salary).toLocaleString("vi-VN");
    const unitLabel = SALARY_UNIT_LABELS[unit] || unit || "VND";
    return `${formatted} ${unitLabel}`;
  }, []);

  const toJobCardModel = React.useCallback((item) => ({
    id: item.id,
    title: item.title || "Công việc",
    company: item.companyName || item.company || "—",
    location: item.location || "—",
    distance: item.distance || null,
    time: item.workingHours || "Linh hoạt",
    rating: item.trustScore ?? item.rating ?? "—",
    reviews: item.reviewCount ?? item.totalReviews ?? 0,
    applicants: item.applicants ?? item.applicantCount ?? 0,
    salary: formatSalary(item.salary, item.salaryUnit),
    tags: [
      item.categoryName || item.category || null,
      item.workMode || null,
      item.jobType || null,
    ].filter(Boolean),
  }), [formatSalary]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const res = await searchAvailableJobs({ page: 0, size: 10 });
        const data = res?.data?.data || res?.data || {};
        const list = Array.isArray(data.content)
          ? data.content
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
              ? data
              : [];
        const mapped = list.map(toJobCardModel);
        setJobs(mapped);
        setCurrentJobIndex(0);
      } catch (err) {
        console.error("Không tải được danh sách việc làm:", err);
        setJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [toJobCardModel]);

  useEffect(() => {
    if (!jobs.length) return;
    const interval = setInterval(() => {
      setCurrentJobIndex((prevIndex) => (prevIndex + 1) % jobs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [jobs.length]);

  const requireAuth = (action) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    action?.();
  };

  const heroJob = jobs[currentJobIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <Header />

      <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white px-6 py-16 md:px-20 md:py-20 shadow-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-semibold shadow-sm backdrop-blur-md mb-4">
              JobMate - Kết nối sinh viên & nhà tuyển dụng uy tín
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
              Tìm việc làm thêm phù hợp
              <span className="block">với lịch học & kỹ năng</span>
            </h1>

            <p className="max-w-xl text-indigo-50/95 leading-relaxed mb-8">
              JobMate phân tích kỹ năng, lịch học và vị trí để gợi ý công việc phù hợp,
              hỗ trợ chat realtime, xác minh CCCD và đánh giá hai chiều.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Button
                onClick={() => navigate("/login")}
                variant="primary"
                className="!bg-slate-900 !text-white hover:!bg-slate-800"
                aria-label="Đăng nhập để bắt đầu tìm việc"
              >
                Tìm việc ngay
              </Button>
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                className="!bg-white !text-blue-700 border border-white hover:!bg-blue-50"
                aria-label="Đăng nhập dành cho nhà tuyển dụng"
              >
                Dành cho nhà tuyển dụng
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div>
                <p className="text-2xl md:text-3xl font-bold">500+</p>
                <p className="text-sm opacity-90">Công việc bán thời gian</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">2,000+</p>
                <p className="text-sm opacity-90">Sinh viên đã xác minh</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">4.8</p>
                <p className="text-sm opacity-90">Đánh giá 2 chiều</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 transition-opacity duration-700 ease-in-out">
            {loadingJobs ? (
              <div className="rounded-2xl border border-white/30 bg-white/10 p-6 text-sm text-white/90 backdrop-blur">
                Đang tải việc làm nổi bật...
              </div>
            ) : heroJob ? (
              <JobCard
                job={heroJob}
                onDetail={() => requireAuth(() => navigate("/home"))}
                onApply={() => requireAuth(() => navigate("/home"))}
              />
            ) : (
              <div className="rounded-2xl border border-white/30 bg-white/10 p-6 text-sm text-white/90 backdrop-blur">
                Chưa có việc làm phù hợp để hiển thị.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto bg-gradient-to-b from-blue-50 to-white py-16 px-6 md:px-20" aria-labelledby="featured-jobs-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h2 id="featured-jobs-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Việc làm nổi bật
            </h2>
            <p className="text-slate-500">
              Những cơ hội việc làm được đề xuất dành riêng cho bạn
            </p>
          </div>
          <Button
            onClick={() => navigate("/login")}
            variant="soft"
            className="!border-indigo-200 !bg-indigo-50 !text-indigo-700 hover:!bg-indigo-100"
            aria-label="Xem toàn bộ danh sách việc làm"
          >
            Xem tất cả
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {loadingJobs && jobs.length === 0 && (
            <div className="col-span-2 text-slate-500 text-sm">Đang tải việc làm...</div>
          )}

          {!loadingJobs && jobs.length === 0 && (
            <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              Hiện chưa có dữ liệu việc làm nổi bật.
            </div>
          )}

          {jobs.slice(0, 4).map((job) => (
            <JobCard
              key={job.id || job.title}
              job={job}
              onDetail={() => requireAuth(() => navigate("/home"))}
              onApply={() => requireAuth(() => navigate("/home"))}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            onClick={() => navigate("/login")}
            variant="primary"
            className="!bg-indigo-600 !text-white hover:!bg-indigo-700"
            aria-label="Mở trang đăng nhập để xem thêm việc làm"
          >
            Xem thêm việc làm
          </Button>
        </div>
      </section>

      <section className="bg-white">
        <StepsSection />
      </section>

      <Footer />
    </div>
  );
}
