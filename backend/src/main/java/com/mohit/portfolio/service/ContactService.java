package com.mohit.portfolio.service;

import com.mohit.portfolio.model.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final JavaMailSender mailSender;

    @Value("${portfolio.contact.to-email}")
    private String toEmail;

    public ContactService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(ContactRequest req) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setReplyTo(req.getEmail());
        message.setSubject("Portfolio Contact: " + req.getName());
        message.setText(
            "Name:    " + req.getName()    + "\n" +
            "Email:   " + req.getEmail()   + "\n\n" +
            "Message:\n" + req.getMessage()
        );
        mailSender.send(message);
    }
}
