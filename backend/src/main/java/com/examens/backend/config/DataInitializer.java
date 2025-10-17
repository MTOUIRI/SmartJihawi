package com.examens.backend.config;

import com.examens.backend.entity.User;
import com.examens.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setName("Administrateur");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            
            System.out.println("Default admin user created:");
            System.out.println("Email: admin@example.com");
            System.out.println("Password: 123456");
        }
    }
}