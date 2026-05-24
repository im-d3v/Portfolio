package com.mohit.portfolio.service;

import com.mohit.portfolio.model.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private static final String RESEND_URL = "https://api.resend.com/emails";

    private final RestClient restClient = RestClient.create();

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from}")
    private String fromAddress;

    @Value("${portfolio.contact.to-email}")
    private String toEmail;

    public void sendContactEmail(ContactRequest req) {
        Map<String, Object> body = Map.of(
            "from",     fromAddress,
            "to",       List.of(toEmail),
            "reply_to", req.getEmail(),
            "subject",  "Portfolio Contact: " + req.getName(),
            "text",
                "Name:    " + req.getName()    + "\n" +
                "Email:   " + req.getEmail()   + "\n\n" +
                "Message:\n" + req.getMessage()
        );

        try {
            restClient.post()
                .uri(RESEND_URL)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
        } catch (Exception e) {
            log.error("Failed to send contact email via Resend: {}", e.getMessage(), e);
            throw e;
        }
    }
}

