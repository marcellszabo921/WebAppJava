package com.example.noteapp.infrastructure.email;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@mynotes.com");
        message.setTo(to);
        message.setSubject("Jelszó visszaállítás - MyNotes");
        message.setText("Kattints az alábbi linkre a jelszavad visszaállításához:\n\n" + resetLink + "\n\nEz a link 15 percig érvényes.");

        mailSender.send(message);
        System.out.println("Email elküldve ide: " + to);
    }
}