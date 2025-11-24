package com.example.noteapp.infrastructure.web;

import com.example.noteapp.core.domain.User;
import com.example.noteapp.infrastructure.persistence.UserRepository;
import com.example.noteapp.infrastructure.security.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // --- REGISZTRÁCIÓ ---
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("A felhasználónév már foglalt!");
        }

        // Jelszó titkosítása
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getAvatarUrl() == null) {
            user.setAvatarUrl("");
        }

        return userRepository.save(user);
    }

    // --- BEJELENTKEZÉS ---
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User foundUser = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Hibás felhasználónév vagy jelszó"));

        if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            return jwtUtil.generateToken(user.getUsername());
        }
        throw new RuntimeException("Hibás felhasználónév vagy jelszó");
    }

    // --- PROFIL FRISSÍTÉSE (Jelszócsere) ---
    @PutMapping("/profile")
    public User updateProfile(@RequestBody UpdateProfileRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található"));

        // Ha jelszót akar cserélni (tehát küldött újat)
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {

            // 1. ELLENŐRZÉS: Megadta a régit?
            if (request.getOldPassword() == null || request.getOldPassword().isEmpty()) {
                throw new RuntimeException("A jelszó módosításához meg kell adnod a jelenlegi jelszavadat!");
            }

            // 2. ELLENŐRZÉS: Jó a régi jelszó?
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new RuntimeException("A megadott jelenlegi jelszó hibás!");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        return userRepository.save(user);
    }

    // --- KÉPFELTÖLTÉS ---
    @PostMapping("/upload-avatar")
    public User uploadAvatar(@RequestParam("file") MultipartFile file) throws IOException {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található"));

        // Base64 konverzió
        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
        String avatarData = "data:" + file.getContentType() + ";base64," + base64Image;

        user.setAvatarUrl(avatarData);
        return userRepository.save(user);
    }

    // --- JELENLEGI USER ADATAI ---
    @GetMapping("/me")
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("A felhasználó nem található"));

        user.setPassword(null);
        return user;
    }

    @Data
    static class UpdateProfileRequest {
        private String oldPassword;
        private String newPassword;
    }
}