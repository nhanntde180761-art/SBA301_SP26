package com.quokka.Chat_Service.controller;

import com.quokka.Chat_Service.dto.ApiResponse;
import com.quokka.Chat_Service.dto.request.ConversationRequest;
import com.quokka.Chat_Service.dto.response.ConversationResponse;
import com.quokka.Chat_Service.service.ConversationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("conversations")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Conversations", description = "Endpoints for managing chat conversations and participants")
public class ConversationController {

    ConversationService conversationService;

    @Operation(summary = "Create a new conversation", description = "Create a conversation between participants")
    @PostMapping("/create")
    public ApiResponse<ConversationResponse> createConversation(@RequestBody ConversationRequest request) {
        return ApiResponse.success(conversationService.create(request));
    }

    @Operation(summary = "Delete a conversation", description = "Remove a conversation and its messages by ID")
    @DeleteMapping("/{conversationId}")
    public ApiResponse<Void> deleteConversation(@PathVariable String conversationId) {
        conversationService.deleteConversation(conversationId);
        return ApiResponse.success(null);
    }

    @Operation(summary = "Get current user's conversations", description = "Retrieve all conversations where the authenticated user is a participant")
    @GetMapping("/my-conversations")
    public ApiResponse<List<ConversationResponse>> myConversations() {
        return ApiResponse.success(conversationService.myConversations());
    }

    @Operation(summary = "Search conversations", description = "Search for conversations by keyword in participant names or other metadata")
    @GetMapping("/search")
    public ApiResponse<List<ConversationResponse>> search(@RequestParam String keyword) {
        return ApiResponse.success(conversationService.searchConversations(keyword));
    }
}
