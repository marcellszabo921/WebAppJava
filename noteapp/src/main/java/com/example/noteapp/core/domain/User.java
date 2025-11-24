package com.example.noteapp.core.domain;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Date;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank(message = "A felhasználónév nem lehet üres")
    private String username;

    @NotBlank(message = "Az email nem lehet üres")
    @Email(message = "Érvénytelen email formátum")
    private String email;

    @NotBlank(message = "A jelszó nem lehet üres")
    @Size(min = 6, message = "A jelszónak legalább 6 karakternek kell lennie")
    private String password;

    private String avatarUrl;
    private String resetToken;
    private Date resetTokenExpiry;
}