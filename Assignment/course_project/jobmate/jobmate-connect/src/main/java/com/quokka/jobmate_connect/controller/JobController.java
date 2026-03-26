package com.quokka.jobmate_connect.controller;

import com.quokka.jobmate_connect.constant.JobStatus;
import com.quokka.jobmate_connect.constant.JobType;
import com.quokka.jobmate_connect.dto.ApiResponse;
import com.quokka.jobmate_connect.dto.PageResponse;
import com.quokka.jobmate_connect.dto.request.job.JobCreationRequest;
import com.quokka.jobmate_connect.dto.response.job.JobDetailResponse;
import com.quokka.jobmate_connect.dto.response.job.JobResponse;
import com.quokka.jobmate_connect.service.JobService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Jobs", description = "Endpoints for posting, searching, and managing job listings")
public class JobController {
    JobService jobService;

    @Operation(summary = "Create job post", description = "Create a new job listing (requires Employer or Admin role)")
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    @PostMapping()
    public ApiResponse<JobResponse> createJob(@RequestBody JobCreationRequest request) {
        return ApiResponse.success(jobService.createJob(request));
    }

    @Operation(summary = "List all jobs (Admin)", description = "Retrieve a paginated list of all job postings in the system")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    public ApiResponse<PageResponse<JobResponse>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(jobService.getAllJobs(page, size));
    }

    @Operation(summary = "Get my posted jobs", description = "Retrieve a paginated list of jobs posted by the currently authenticated employer")
    @GetMapping("/my-jobs")
    public ApiResponse<PageResponse<JobResponse>> getMyPostedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) JobStatus status) {
        return ApiResponse.success(jobService.getMyJobs(page, size, status));
    }

    @Operation(summary = "Get nearby jobs", description = "Find job postings within a certain radius of the user's current location")
    @GetMapping("/nearby")
    public ApiResponse<PageResponse<JobResponse>> getNearbyJobs(
            @RequestParam(defaultValue = "10") double radiusInKm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        var result = jobService.getNearByJob(radiusInKm, page, size);
        return ApiResponse.success(result);
    }

    @Operation(summary = "Update job post", description = "Modify an existing job listing by its ID")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @PutMapping("/{jobId}")
    public ApiResponse<JobResponse> updateJob(@PathVariable("jobId") UUID jobId,
            @RequestBody JobCreationRequest request) {
        return ApiResponse.success(jobService.updateJob(jobId, request));
    }

    @Operation(summary = "Verify job (Admin)", description = "Approve or reject a job posting with an optional reason")
    @PutMapping("/{jobId}/verify-job")
    public ApiResponse<Void> verifyJob(@PathVariable UUID jobId,
            @RequestParam JobStatus status,
            @RequestParam(required = false) String reason) {
        jobService.updateJobVerificationStatus(jobId, status, reason);
        return ApiResponse.success(null);
    }

    @Operation(summary = "Search available jobs", description = "Search and filter job postings that are currently active and open")
    @GetMapping("/available")
    public ApiResponse<PageResponse<JobResponse>> getAvailableJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) BigDecimal salaryMin,
            @RequestParam(required = false) BigDecimal salaryMax) {
        return ApiResponse.success(
                jobService.getAvailableJobs(page, size, keyword, location, jobType, workMode, categoryId, salaryMin,
                        salaryMax));
    }

    @Operation(summary = "Get basic job info", description = "Retrieve basic information of a job posting by its ID")
    @GetMapping("/{jobId}")
    public ApiResponse<JobResponse> getJobDetail(@PathVariable UUID jobId) {
        return ApiResponse.success(jobService.getJobDetails(jobId));
    }

    @Operation(summary = "Get full job details", description = "Retrieve comprehensive information including requirements and employer details")
    @GetMapping("/details/{jobId}")
    public ApiResponse<JobDetailResponse> getJobFullDetail(@PathVariable UUID jobId) {
        return ApiResponse.success(jobService.getJobDetailById(jobId));
    }

    @Operation(summary = "Close job listing", description = "Mark a job posting as closed/inactive")
    @PutMapping("/{id}/close")
    public ApiResponse<Void> closeJob(@PathVariable UUID id) {
        return ApiResponse.success(jobService.closeJob(id));
    }

    @Operation(summary = "Delete job listing", description = "Soft delete a job posting by its ID")
    @PutMapping("/{id}/delete")
    public ApiResponse<Void> deleteJob(@PathVariable UUID id) {
        return ApiResponse.success(jobService.deleteJob(id));
    }
}
