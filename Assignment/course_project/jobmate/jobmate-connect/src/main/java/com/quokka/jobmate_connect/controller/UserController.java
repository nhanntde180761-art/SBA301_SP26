package com.quokka.jobmate_connect.controller;

import com.quokka.jobmate_connect.dto.ApiResponse;
import com.quokka.jobmate_connect.dto.PageResponse;
import com.quokka.jobmate_connect.dto.request.user.LocationRequest;
import com.quokka.jobmate_connect.dto.request.user.PasswordUpdateRequest;
import com.quokka.jobmate_connect.dto.request.user.TwoFaUpdateRequest;
import com.quokka.jobmate_connect.dto.request.user.UserCreationRequest;
import com.quokka.jobmate_connect.dto.request.user.UserUpdateRequest;
import com.quokka.jobmate_connect.dto.response.user.*;
import com.quokka.jobmate_connect.service.LocationService;
import com.quokka.jobmate_connect.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Users", description = "Endpoints for user profile management, registration, and location tracking")
public class UserController {
    UserService userService;
    LocationService locationService;

    @Operation(summary = "Register user", description = "Create a new user account with basic information")
    @PostMapping("/registration")
    ApiResponse<UserResponse> createUser(@RequestBody UserCreationRequest request) {
        return ApiResponse.success(userService.createUser(request));
    }

    @Operation(summary = "Get current user info", description = "Retrieve detailed information of the currently authenticated user")
    @GetMapping("/my-info")
    ApiResponse<UserDetailResponse> getMyInfo() {
        return ApiResponse.success(userService.getMyInfo());
    }

    @Operation(summary = "Get current user stats", description = "Retrieve statistics like job count, rating, etc. for the authenticated user")
    @GetMapping("/my-stats")
    ApiResponse<UserStatsResponse> getMyStats() {
        return ApiResponse.success(userService.getMyStats());
    }

    @Operation(summary = "List all users (Admin)", description = "Retrieve a paginated list of all users with optional filtering by status and role")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    ApiResponse<PageResponse<UserListResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role) {

        var results = userService.getAllUsers(page, size, status, role);
        return ApiResponse.success(results);
    }

    @Operation(summary = "Update profile", description = "Update personal information and profile picture for the authenticated user")
    @PutMapping()
    public ApiResponse<UserResponse> updateUser(
            @RequestBody UserUpdateRequest request) {
        return ApiResponse.success(userService.updateUser(request));
    }

    @Operation(summary = "Get user by ID", description = "Retrieve public information of a user by their unique ID")
    @GetMapping("/{id}")
    ApiResponse<UserResponse> getUserById(@PathVariable UUID id) {
        return ApiResponse.success(userService.getUserById(id));
    }

    @Operation(summary = "Get top rated users", description = "Retrieve a paginated list of users sorted by their ratings")
    @GetMapping("/top-rated")
    public ApiResponse<PageResponse<UserResponse>> getTopRatedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(userService.getTopRatedUsers(page, size));
    }

    @Operation(summary = "Get top 10 rated users", description = "Retrieve a list of the 10 highest-rated users")
    @GetMapping("/top-10")
    public ApiResponse<List<UserResponse>> getTop10RatedUsers() {
        return ApiResponse.success(userService.getTop10RatedUsers());
    }

    @Operation(summary = "Update location", description = "Update the geographical coordinates of the authenticated user")
    @PutMapping("/location")
    public ApiResponse<Void> updateLocation(@RequestBody LocationRequest request) {
        locationService.updateLocation(request);
        return ApiResponse.success(null);
    }

    @Operation(summary = "Update 2FA status", description = "Enable or disable Two-Factor Authentication for the authenticated user")
    @PutMapping("/two-fa")
    public ApiResponse<TwoFaStatusResponse> updateTwoFa(@Valid @RequestBody TwoFaUpdateRequest request) {
        return ApiResponse.success(userService.updateTwoFactorStatus(request));
    }

    @Operation(summary = "Update password", description = "Change password for the authenticated user")
    @PutMapping("/password")
    public ApiResponse<Void> updatePassword(@Valid @RequestBody PasswordUpdateRequest request) {
        userService.updatePassword(request);
        return ApiResponse.success(null);
    }

    @Operation(summary = "Get auto location", description = "Determine user location based on their IP address")
    @GetMapping("/location/auto")
    public ApiResponse<LocationResponse> getUserAutoLocation(HttpServletRequest req) {
        return ApiResponse.success(locationService.getAutoLocation(req));
    }

    @Operation(summary = "Upgrade to Employer (Admin)", description = "Elevate a regular user's role to Employer")
    @PatchMapping("/{id}/upgrade-employer")
    public ApiResponse<Void> upgradeUserToEmployer(@PathVariable UUID id) {
        userService.upgradeUserToEmployer(id);
        return ApiResponse.success(null);
    }
}
