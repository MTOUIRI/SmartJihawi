// UserRequest.java (DTO)

package com.examens.backend.dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserRequest {
    
    @NotBlank(message = "Le nom est requis")
    private String name;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "Format email invalide")
    private String email;
    
    private String password; // Optional for updates
    
    @NotBlank(message = "Le rôle est requis")
    private String role;
    
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}