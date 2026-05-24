package com.mohit.portfolio.service;

import com.mohit.portfolio.model.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final JavaMailSender mailSender;

    @Value("${portfolio.contact.to-email}")
    private String toEmail;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public ContactService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(ContactRequest req) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setReplyTo(req.getEmail());
            message.setSubject("Portfolio Contact: " + req.getName());
            message.setText(
                "Name:    " + req.getName()    + "\n" +
                "Email:   " + req.getEmail()   + "\n\n" +
                "Message:\n" + req.getMessage()
            );
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send contact email: {}", e.getMessage(), e);
            throw e;
        }
    }
}
