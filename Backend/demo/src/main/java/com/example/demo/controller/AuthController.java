package com.example.demo.controller;
import com.example.demo.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostConstruct
    public void init() {
        System.out.println("✅ AuthController está activo y ejecutándose.");
    }


    @Autowired
    private UsuarioRepository usuarioRepository; // 📌 Conectado a la BD



}

