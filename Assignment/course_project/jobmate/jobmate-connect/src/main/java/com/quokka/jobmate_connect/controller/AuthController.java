package com.quokka.jobmate_connect.controller;

import com.nimbusds.jose.JOSEException;
import com.quokka.jobmate_connect.dto.ApiResponse;
import com.quokka.jobmate_connect.dto.request.user.AuthenticationRequest;
import com.quokka.jobmate_connect.dto.request.user.IntrospectRequest;
import com.quokka.jobmate_connect.dto.request.user.LogoutRequest;
import com.quokka.jobmate_connect.dto.request.otp.VerifyOtpRequest;
import com.quokka.jobmate_connect.dto.request.otp.ResendOtpRequest;
import com.quokka.jobmate_connect.dto.request.user.ForgotPasswordRequest;
import com.quokka.jobmate_connect.dto.request.user.ResetPasswordRequest;
import com.quokka.jobmate_connect.dto.request.user.SetPasswordRequest;
import com.quokka.jobmate_connect.dto.response.user.AuthenticationResponse;
import com.quokka.jobmate_connect.dto.response.user.ForgotPasswordResponse;
import com.quokka.jobmate_connect.dto.response.user.IntrospectResponse;
import com.quokka.jobmate_connect.dto.response.otp.ResendOtpResponse;
import com.quokka.jobmate_connect.dto.response.user.ResetPasswordResponse;
import com.quokka.jobmate_connect.dto.response.user.SetPasswordResponse;
import com.quokka.jobmate_connect.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Endpoints for user login, logout, password recovery and session management")
public class AuthController {
    AuthenticationService authenticationService;

    @Operation(summary = "Google OAuth2 callback", description = "Handle Google OAuth2 code and return authentication token")
    @PostMapping("/outbound/authentication")
    ApiResponse<AuthenticationResponse> outboundAuthentication(@RequestParam("code") String code) {
        var result = authenticationService.outboundAuthenticate(code);
        return ApiResponse.success(result);
    }

    @Operation(summary = "Introspect token", description = "Validate a JWT token and return its claims")
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException {
        var result = authenticationService.introspect(request);
        return ApiResponse.success(result);
    }

    @Operation(summary = "Login", description = "Authenticate user with username and password")
    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ApiResponse.success(authenticationService.authenticate(request));
    }

    @Operation(summary = "Refresh token", description = "Generate a new access token using a refresh token or an active session")
    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refresh(@RequestBody IntrospectRequest request) {
        return ApiResponse.success(authenticationService.refresh(request));
    }

    @Operation(summary = "Logout", description = "Invalidate user session and token")
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request)
            throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.success(null);
    }

    @Operation(summary = "Verify OTP", description = "Verify one-time password for account activation or verification")
    @PostMapping("/verify-otp")
    ApiResponse<AuthenticationResponse> verifyOtp(@RequestBody VerifyOtpRequest request) {
        var result = authenticationService.verifyOtp(request);
        return ApiResponse.success(result);
    }

    @Operation(summary = "Resend OTP", description = "Send a new OTP to the user's email")
    @PostMapping("/resend-otp")
    ApiResponse<ResendOtpResponse> resendOtp(@RequestBody ResendOtpRequest request) {
        var result = authenticationService.resendOtp(request.getUserId());
        return ApiResponse.success(result);
    }

    @Operation(summary = "Set password", description = "Set password for a user account (e.g., after Google registration)")
    @PostMapping("/set-password")
    ApiResponse<SetPasswordResponse> setPassword(@RequestParam("userId") String userId,
            @RequestBody SetPasswordRequest request) {
        var result = authenticationService.setPassword(userId, request);
        return ApiResponse.success(result);
    }

    @Operation(summary = "Forgot password", description = "Initiate password recovery process via email")
    @PostMapping("/forgot-password")
    ApiResponse<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        var result = authenticationService.forgotPassword(request);
        return ApiResponse.success(result);
    }

    @Operation(summary = "Reset password", description = "Reset password using the recovery token sent via email")
    @PostMapping("/reset-password")
    ApiResponse<ResetPasswordResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        var result = authenticationService.resetPassword(request);
        return ApiResponse.success(result);
    }
}
