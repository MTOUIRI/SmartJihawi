package com.examens.backend.dto.Auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {
    
    @NotBlank(message = "Le nom complet est requis")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String fullName;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;
    
    @NotBlank(message = "La confirmation du mot de passe est requise")
    private String confirmPassword;
    
    @NotBlank(message = "Le numéro de téléphone est requis")
    @Pattern(regexp = "^(0|\\+212)[5-7]\\d{8}$", message = "Numéro de téléphone marocain invalide")
    private String phone;
    
    @NotBlank(message = "L'établissement scolaire est requis")
    private String school;
    
    @NotBlank(message = "Le niveau est requis")
    private String level;
    
    // Constructors
    public RegisterRequest() {}
    
    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }
    
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}