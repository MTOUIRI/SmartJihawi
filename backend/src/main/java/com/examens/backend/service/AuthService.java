package com.examens.backend.service;

import com.examens.backend.dto.Auth.LoginRequest;
import com.examens.backend.dto.Auth.LoginResponse;
import com.examens.backend.dto.Auth.RegisterRequest;
import com.examens.backend.dto.Auth.UserInfo;
import com.examens.backend.entity.User;
import com.examens.backend.repository.UserRepository;
import com.examens.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private EmailService emailService;
    
    /**
     * Universal login method - automatically detects user type
     * Students must have paid to login
     * Admins can always login
     */
    public LoginResponse login(LoginRequest loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );
        } catch (Exception e) {
            logger.error("Authentication failed for: {}", loginRequest.getEmail());
            throw new Exception("Email ou mot de passe incorrect", e);
        }
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new Exception("Utilisateur non trouvé"));
        
        // Handle based on role
        if (user.getRole() == User.Role.STUDENT) {
            // Check if student has paid
            if (!user.getIsPaid()) {
                logger.info("Unpaid student attempted login: {}", loginRequest.getEmail());
                throw new Exception("Votre compte n'est pas encore activé. Veuillez effectuer le paiement et envoyer votre reçu.");
            }
            
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails, "ROLE_STUDENT");
            
            UserInfo userInfo = new UserInfo(
                user.getId(), 
                user.getName(), 
                user.getEmail(), 
                "student"
            );
            
            logger.info("Student logged in successfully: {}", user.getEmail());
            return new LoginResponse(token, userInfo);
            
        } else if (user.getRole() == User.Role.ADMIN) {
            // Admin login - no payment check needed
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails, "ROLE_ADMIN");
            
            UserInfo userInfo = new UserInfo(
                user.getId(), 
                user.getName(), 
                user.getEmail(), 
                "admin"
            );
            
            logger.info("Admin logged in successfully: {}", user.getEmail());
            return new LoginResponse(token, userInfo);
            
        } else {
            throw new Exception("Type d'utilisateur non reconnu");
        }
    }
    
    /**
     * Admin-specific login method (explicit admin login)
     * Only allows users with ADMIN role
     */
    public LoginResponse adminLogin(LoginRequest loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );
        } catch (Exception e) {
            logger.error("Admin authentication failed for: {}", loginRequest.getEmail());
            throw new Exception("Email ou mot de passe incorrect", e);
        }
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new Exception("Utilisateur non trouvé"));
        
        // Check if user is an admin
        if (user.getRole() != User.Role.ADMIN) {
            logger.warn("Non-admin attempted to login via admin endpoint: {}", loginRequest.getEmail());
            throw new Exception("Accès réservé aux administrateurs");
        }
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        String token = jwtUtil.generateToken(userDetails, "ROLE_ADMIN");
        
        UserInfo userInfo = new UserInfo(
            user.getId(), 
            user.getName(), 
            user.getEmail(), 
            "admin"
        );
        
        logger.info("Admin logged in successfully via admin endpoint: {}", user.getEmail());
        return new LoginResponse(token, userInfo);
    }
    
    /**
     * Student registration - UPDATED to use city instead of school/level
     */
    public LoginResponse registerStudent(RegisterRequest registerRequest) throws Exception {
        // Validate passwords match
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new Exception("Les mots de passe ne correspondent pas");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new Exception("Cet email est déjà utilisé");
        }
        
        // Create new student user (NOT PAID initially)
        User student = new User();
        student.setName(registerRequest.getFullName());
        student.setEmail(registerRequest.getEmail());
        student.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        student.setPhone(registerRequest.getPhone());
        student.setCity(registerRequest.getCity()); // Changed from setSchool
        // Removed setLevel - no longer needed
        student.setRole(User.Role.STUDENT);
        student.setIsPaid(false); // Not paid initially
        
        // Save user
        User savedUser = userRepository.save(student);
        
        // Send welcome email asynchronously (don't block registration if email fails)
        try {
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getName());
            logger.info("Welcome email sent to new student: {}", savedUser.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}. Error: {}", 
                savedUser.getEmail(), e.getMessage());
        }
        
        // Return success message (no token yet, user needs to pay)
        UserInfo userInfo = new UserInfo(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            "student"
        );
        
        logger.info("New student registered: {}", savedUser.getEmail());
        return new LoginResponse(null, userInfo);
    }
    
    /**
     * Verify payment and activate student account
     */
    public void verifyPayment(Long userId) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("Utilisateur non trouvé"));
        
        // Update payment status
        user.setIsPaid(true);
        user.setPaymentVerifiedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        
        // Send payment confirmation email
        try {
            emailService.sendPaymentConfirmationEmail(updatedUser.getEmail(), updatedUser.getName());
            logger.info("Payment confirmation email sent to: {}", updatedUser.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send payment confirmation email to: {}. Error: {}", 
                updatedUser.getEmail(), e.getMessage());
        }
        
        logger.info("Payment verified for user: {}", updatedUser.getEmail());
    }
}