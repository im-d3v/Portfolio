package com.mohit.portfolio.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 120)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Message is required")
    @Size(min = 5, max = 3000, message = "Message must be 5–3000 characters")
    private String message;

    public ContactRequest() {}

    public String getName()    { return name; }
    public String getEmail()   { return email; }
    public String getMessage() { return message; }

    public void setName(String name)       { this.name = name; }
    public void setEmail(String email)     { this.email = email; }
    public void setMessage(String message) { this.message = message; }
}
