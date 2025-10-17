package com.examens.backend.controller;

import com.examens.backend.dto.Auth.UserRequest;
import com.examens.backend.entity.User;
import com.examens.backend.service.UserService;
import com.examens.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/pending-payment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getPendingPaymentUsers() {
        List<User> pendingUsers = userService.getPendingPaymentUsers();
        return ResponseEntity.ok(pendingUsers);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequest userRequest) {
        try {
            User user = userService.createUser(userRequest);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse("Échec de la création", e.getMessage())
            );
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest userRequest) {
        try {
            User user = userService.updateUser(id, userRequest);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse("Échec de la modification", e.getMessage())
            );
        }
    }
    
    @PatchMapping("/{id}/verify-payment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id) {
        try {
            authService.verifyPayment(id);
            return ResponseEntity.ok(new MessageResponse("Paiement vérifié avec succès. L'utilisateur peut maintenant accéder à la plateforme."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse("Échec de la vérification", e.getMessage())
            );
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new MessageResponse("Utilisateur supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ErrorResponse("Échec de la suppression", e.getMessage())
            );
        }
    }
    
    // Helper classes for responses
    public static class ErrorResponse {
        private String error;
        private String message;
        
        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }
        
        public String getError() { return error; }
        public String getMessage() { return message; }
    }
    
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
    }
}