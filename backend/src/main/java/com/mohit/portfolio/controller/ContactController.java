package com.mohit.portfolio.controller;

import com.mohit.portfolio.model.ApiResponse;
import com.mohit.portfolio.model.ContactRequest;
import com.mohit.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse> contact(@Valid @RequestBody ContactRequest request) {
        contactService.sendContactEmail(request);
        return ResponseEntity.ok(new ApiResponse(true, "Message sent successfully."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleError(Exception ex) {
        return ResponseEntity
            .internalServerError()
            .body(new ApiResponse(false, "Failed to send message. Please try again."));
    }
}
