package com.quokka.Chat_Service.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.quokka.Chat_Service.dto.ApiResponse;
import com.quokka.Chat_Service.dto.request.ChatMessageRequest;
import com.quokka.Chat_Service.dto.response.ChatMessageResponse;
import com.quokka.Chat_Service.service.ChatMessageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/messages")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Chat Messages", description = "Endpoints for managing chat messages")
public class ChatMessageController {
    ChatMessageService chatMessageService;

    @Operation(summary = "Create a new message", description = "Save a message to the database and return the created message object")
    @PostMapping("/create")
    public ApiResponse<ChatMessageResponse> create(@RequestBody ChatMessageRequest request) throws JsonProcessingException {
        return ApiResponse.success(chatMessageService.create(request));
    }

    @Operation(summary = "Get messages by conversation", description = "Retrieve all messages belonging to a specific conversation ID")
    @GetMapping
    public ApiResponse<List<ChatMessageResponse>> getMessages(@RequestParam("conversationId") String conversationId) {
        return ApiResponse.success(chatMessageService.getMessages(conversationId));
    }
}
