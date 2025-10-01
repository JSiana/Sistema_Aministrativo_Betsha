package com.example.demo.service;

import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.model.Usuarios;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    Usuarios crearUsuario(Usuarios usuario);

    List<UsuarioResponseDTO> listarUsuarios();

    boolean existeUsuario(String nombreUsuario);

    boolean existeEmail(String email);

    Optional<Usuarios> buscarPorUsuario(String usarios);

    Usuarios guardarUsuario(Usuarios usuario);
}
