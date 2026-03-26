import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAvailableJobs, getNearbyJobs } from '../services/jobService';
import { getAllCategories } from '../services/categoryService';
import { showError } from '../utils/toast';

export const useJobs = (pageSize = 12) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [categories, setCategories] = useState([]);
    
    // Memoize filters to prevent unnecessary effect triggers
    const filters = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '0'),
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        jobType: searchParams.get('jobType') || '',
        workMode: searchParams.get('workMode') || '',
        categoryId: searchParams.get('categoryId') || '',
        salaryMin: searchParams.get('salaryMin') || '',
        salaryMax: searchParams.get('salaryMax') || '',
    }), [searchParams]);

    const setFilter = (newFilters) => {
        const updated = { ...filters, ...newFilters, page: 0 }; // Reset to page 0 on filter change
        const params = {};
        Object.keys(updated).forEach(key => {
            if (updated[key]) params[key] = updated[key];
        });
        setSearchParams(params);
    };

    const setPage = (page) => {
        const params = {};
        searchParams.forEach((val, key) => params[key] = val);
        params.page = page;
        setSearchParams(params);
    };

    const fetchCategories = useCallback(async () => {
        try {
            const res = await getAllCategories();
            setCategories(res?.data?.data || []);
        } catch (err) {
            console.error("Lỗi tải categories");
        }
    }, []);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== 0);
            
            const params = {
                page: filters.page,
                size: pageSize,
                keyword: filters.keyword || null,
                location: filters.location || null,
                jobType: filters.jobType || null,
                workMode: filters.workMode || null,
                categoryId: filters.categoryId || null,
                salaryMin: filters.salaryMin ? Number(filters.salaryMin) : null,
                salaryMax: filters.salaryMax ? Number(filters.salaryMax) : null,
            };

            const res = await searchAvailableJobs(params);
            const pageData = res?.data?.data || {};
            setJobs(pageData?.data || []);
            setTotalPages(pageData?.totalPages || 0);
            setTotalElements(pageData?.totalElements || 0);
        } catch (err) {
            showError("Lỗi khi tải danh sách công việc");
        } finally {
            setLoading(false);
        }
    }, [filters, pageSize]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const resetFilters = () => {
        setSearchParams({});
    };

    return {
        jobs,
        loading,
        totalPages,
        totalElements,
        categories,
        filters,
        setFilter,
        setPage,
        resetFilters,
        refresh: fetchJobs
    };
};
