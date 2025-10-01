package com.example.demo.service.implementacion;


import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.model.Usuarios;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.UsuarioService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuarios crearUsuario(Usuarios usuario){
        return usuarioRepository.save(usuario);
    }

    @Override
    public List<UsuarioResponseDTO> listarUsuarios(){
        List<Usuarios> usuarios = usuarioRepository.findAll();

        return usuarios.stream().map( u-> new UsuarioResponseDTO(
                u.getId(),
                u.getUsuario(),
                u.getNombre(),
                u.getEmail(),
                u.getRol().getNombreRol(),
                u.getEstado()
        )).collect(Collectors.toList());
    }

    @Override
    public boolean existeUsuario(String nombreUsuario){
        return usuarioRepository.existsByUsuario(nombreUsuario);
    }

    @Override
    public boolean existeEmail(String email){
        return usuarioRepository.existsByEmail(email);
    }

    @Override
    public Optional<Usuarios> buscarPorUsuario(String usuario){
        return usuarioRepository.findByUsuario(usuario);
    }

    @Override
    public Usuarios guardarUsuario(Usuarios usuario){
        return usuarioRepository.save(usuario);
    }
}
