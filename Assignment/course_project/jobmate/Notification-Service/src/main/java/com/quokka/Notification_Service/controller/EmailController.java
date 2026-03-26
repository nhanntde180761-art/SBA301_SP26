package com.quokka.Notification_Service.controller;

import com.quokka.Notification_Service.dto.ApiResponse;
import com.quokka.Notification_Service.dto.request.SendEmailRequest;
import com.quokka.Notification_Service.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/email")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Email Notification", description = "Endpoints for sending system notifications via email")
public class EmailController {

    EmailService emailService;

    @Operation(summary = "Send notification email", description = "Send a plain text or HTML email to a user based on the provided request")
    @PostMapping("/send")
    public ApiResponse<String> sendEmail(@RequestBody SendEmailRequest request) {
        return ApiResponse.success(emailService.sendEmail(request));
    }

}
