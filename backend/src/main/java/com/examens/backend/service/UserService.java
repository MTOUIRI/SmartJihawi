package com.examens.backend.service;

import com.examens.backend.dto.Auth.UserRequest;
import com.examens.backend.entity.User;
import com.examens.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getPendingPaymentUsers() {
        return userRepository.findAll().stream()
            .filter(user -> user.getRole() == User.Role.STUDENT && !user.getIsPaid())
            .collect(Collectors.toList());
    }
    
    public User createUser(UserRequest userRequest) throws Exception {
        // Check if email already exists
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new Exception("Cet email est déjà utilisé");
        }
        
        User user = new User();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRole(User.Role.valueOf(userRequest.getRole()));
        
        // Admin users are automatically marked as paid
        if (user.getRole() == User.Role.ADMIN) {
            user.setIsPaid(true);
        } else {
            // Send welcome email to students
            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            } catch (Exception e) {
                // Don't fail user creation if email fails
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }
        }
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, UserRequest userRequest) throws Exception {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new Exception("Utilisateur non trouvé"));
        
        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(userRequest.getEmail())) {
            if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
                throw new Exception("Cet email est déjà utilisé");
            }
        }
        
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setRole(User.Role.valueOf(userRequest.getRole()));
        
        // Only update password if provided
        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) throws Exception {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new Exception("Utilisateur non trouvé"));
        
        userRepository.delete(user);
    }
}