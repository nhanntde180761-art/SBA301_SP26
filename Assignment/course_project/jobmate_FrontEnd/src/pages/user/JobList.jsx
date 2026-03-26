import React, { useState } from "react";
import { 
  Search, Filter, X, MapPin, Briefcase, 
  DollarSign, SlidersHorizontal, RotateCcw 
} from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import { VIETNAM_CITIES, JOB_TYPE_OPTIONS, WORK_MODE_OPTIONS } from "../../constants/jobFilters";
import JobCard from "../../components/Overview/JobCard";
import ApplicationModal from "../../components/User/ApplicationModal";
import { Skeleton } from "../../components/Common";

export default function JobList({ onViewDetail, userInfo }) {
  const {
    jobs, loading, totalPages, totalElements, categories,
    filters, setFilter, setPage, resetFilters
  } = useJobs(12);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  
  // Local state for search to avoid stuttering on every keystroke
  const [localSearch, setLocalSearch] = useState(filters.keyword);

  // Sync local search with URL filter after 500ms delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.keyword) {
        setFilter({ keyword: localSearch });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.keyword, setFilter]);

  // Sync local search if URL changes (e.g. on Reset)
  React.useEffect(() => {
    setLocalSearch(filters.keyword);
  }, [filters.keyword]);

  const handleApply = (job) => setSelectedJobForApply(job);

  const FilterPanel = ({ mobile = false, showHeader = true }) => {
    const cardClass = mobile ? "app-card-muted p-4 space-y-3" : "app-card-muted p-5 space-y-3";
    const selectClass = mobile
      ? "app-select h-10 border-transparent bg-surface-100"
      : "app-select h-10 border-transparent bg-surface-100";

    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-primary-900 flex items-center gap-2">
              <Filter size={20} className="text-brand-600" /> Lọc công việc
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 uppercase tracking-wider"
            >
              <RotateCcw size={12} /> Đặt lại
            </button>
          </div>
        )}

        <div className={cardClass}>
          <label className="text-xs font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin size={14} /> Vị trí
          </label>
          <select
            className={selectClass}
            value={filters.location}
            onChange={(e) => setFilter({ location: e.target.value })}
          >
            <option value="">Tất cả vị trí</option>
            {VIETNAM_CITIES.map(city => (
              <option key={city.value} value={city.value}>{city.label}</option>
            ))}
          </select>
        </div>

        <div className={cardClass}>
          <label className="text-xs font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={14} /> Danh mục
          </label>
          <select
            className={selectClass}
            value={filters.categoryId}
            onChange={(e) => setFilter({ categoryId: e.target.value })}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className={cardClass}>
          <label className="text-xs font-black text-primary-400 uppercase tracking-widest">Loại công việc</label>
          <div className="space-y-2">
            {JOB_TYPE_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={mobile ? "jobTypeMobile" : "jobTypeDesktop"}
                  className="w-4 h-4 text-brand-600 border-primary-200 focus:ring-brand-500"
                  checked={filters.jobType === opt.value}
                  onChange={() => setFilter({ jobType: opt.value })}
                />
                <span className="text-sm font-medium text-primary-600 group-hover:text-brand-600 transition-colors">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={cardClass}>
          <label className="text-xs font-black text-primary-400 uppercase tracking-widest">Chế độ làm việc</label>
          <select
            className={selectClass}
            value={filters.workMode}
            onChange={(e) => setFilter({ workMode: e.target.value })}
          >
            <option value="">Tất cả chế độ</option>
            {WORK_MODE_OPTIONS.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
        </div>

        <div className={cardClass}>
          <label className="text-xs font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
            <DollarSign size={14} /> Khoảng lương
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Tối thiểu"
              className="app-input h-9 text-xs px-2"
              value={filters.salaryMin}
              onChange={(e) => setFilter({ salaryMin: e.target.value })}
            />
            <span className="text-primary-300">—</span>
            <input
              type="number"
              placeholder="Tối đa"
              className="app-input h-9 text-xs px-2"
              value={filters.salaryMax}
              onChange={(e) => setFilter({ salaryMax: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-100 pb-12">
      {/* Top Search Bar (Sticky) */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-primary-100 shadow-soft">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-brand-600 transition-colors" size={20} />
            <input
              type="text"
              className="app-input pl-12 h-12 text-base font-medium shadow-soft"
              placeholder="Tìm công việc, công ty hoặc kỹ năng..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 app-btn-secondary h-12 px-6"
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
            <div className="sticky top-28 space-y-6">
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-primary-900 uppercase tracking-tight">Vị trí đang tuyển dụng</h2>
                <p className="text-sm text-primary-500 font-medium">Found <span className="text-brand-600">{totalElements}</span> jobs matching your criteria</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map(job => (
                    <JobCard 
                      key={job.id || job.jobId} 
                      job={job} 
                      onDetail={() => onViewDetail(job.id || job.jobId)}
                      onApply={() => handleApply(job)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-10">
                    <button 
                      disabled={filters.page === 0}
                      onClick={() => setPage(filters.page - 1)}
                      className="app-btn-secondary px-4 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setPage(i)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${filters.page === i ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 scale-110' : 'app-btn-secondary border-transparent'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      disabled={filters.page >= totalPages - 1}
                      onClick={() => setPage(filters.page + 1)}
                      className="app-btn-secondary px-4 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="app-card border-dashed py-20 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-300 mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-primary-900 mb-2">Không tìm thấy công việc phù hợp</h3>
                <p className="text-primary-500 max-w-sm mb-6">Chúng tôi không tìm thấy vị trí nào phù hợp với bộ lọc hiện tại của bạn. Hãy thử đặt lại tìm kiếm hoặc điều chỉnh bộ lọc.</p>
                <button onClick={resetFilters} className="app-btn-primary px-8">Đặt lại tất cả bộ lọc</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative w-full max-w-sm bg-white h-full shadow-2xl p-5 sm:p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-primary-900">Filters</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 uppercase tracking-wider"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6">
              <FilterPanel mobile showHeader={false} />
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="app-btn-primary w-full mt-6">Apply Filters</button>
          </aside>
        </div>
      )}

      {/* Modals */}
      {selectedJobForApply && (
        <ApplicationModal
          isOpen={true}
          onClose={() => setSelectedJobForApply(null)}
          jobTitle={selectedJobForApply.title}
          userInfo={userInfo}
          jobId={selectedJobForApply.id || selectedJobForApply.job_id}
        />
      )}
    </div>
  );
}
