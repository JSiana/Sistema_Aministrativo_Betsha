package com.example.demo.controller;


import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UsuarioDTO;
import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.model.Roles;
import com.example.demo.model.Usuarios;
import com.example.demo.repository.RolesRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.RolesService;
import com.example.demo.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {



    private final UsuarioService usuarioService;
    private final RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UsuarioController(UsuarioService usuarioService, RolesRepository rolesRepository){

        this.usuarioService=usuarioService;
        this.rolesRepository = rolesRepository;
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody UsuarioDTO usuarioDTO){

        //VALIDAR NOMBRE DE USUARIO
        if(usuarioService.existeUsuario(usuarioDTO.getUsuario())){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("El nombre de usuario ya esta registrado");
        }

        if(usuarioService.existeEmail(usuarioDTO.getEmail())){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(("El email del usuario ya esta registrado"));
        }

        // BUSCAR EL ROL POR EL ID
        Roles rol = rolesRepository.findById(usuarioDTO.getRolId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado con id: " + usuarioDTO.getRolId()));

        // CREAR USUARIO POR DTO
        Usuarios usuario = new Usuarios();
        usuario.setUsuario(usuarioDTO.getUsuario());
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setEmail(usuarioDTO.getEmail());

        // ENCRIPTACION DE LA CONTRASENIA
        usuario.setContrasenia(passwordEncoder.encode(usuarioDTO.getContrasenia()));

        usuario.setRol(rol);
        usuario.setEstado(true);

        // GUARDAR ELL USUARIO
        Usuarios nuevoUsuario = usuarioService.crearUsuario(usuario);

        // RESPUESTA DE DTO
        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(nuevoUsuario.getId());
        response.setUsuario(nuevoUsuario.getUsuario());
        response.setNombre(nuevoUsuario.getNombre());
        response.setEmail(nuevoUsuario.getEmail());
        response.setRolNombre(nuevoUsuario.getRol().getNombreRol());
        response.setEstado(nuevoUsuario.getEstado());

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios(){
        List<UsuarioResponseDTO> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {


        Optional<Usuarios> usuarioOpt = usuarioService.buscarPorUsuario(loginRequest.getUsuario());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado");
        }

        Usuarios usuario = usuarioOpt.get();

        // Verificar si el usuario está bloqueado
        if (usuario.getFechaBloqueo() != null && usuario.getFechaBloqueo().isAfter(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.LOCKED)
                    .body("Has superado el número máximo de intentos fallidos. Intenta más tarde.");
        }


        if (!passwordEncoder.matches(loginRequest.getContrasenia(), usuario.getContrasenia())) {
            // Incrementar inentos fallidos
            usuario.setIntentosFallidos(usuario.getIntentosFallidos() + 1);

            // Bloquear si supera 3 intentos
            if (usuario.getIntentosFallidos() >= 3){
                usuario.setFechaBloqueo(LocalDateTime.now().plusMinutes(15));
                usuarioService.guardarUsuario(usuario);
                return ResponseEntity.status(HttpStatus.LOCKED)
                        .body("Has superado el número máximo de intentos fallidos. Intenta más tarde.");
            }

            usuarioService.guardarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }

        //login exitoso y desbloquea
        usuario.setIntentosFallidos(0);
        usuario.setFechaBloqueo(null);
        usuarioService.guardarUsuario(usuario);

        String token = jwtUtil.generateToken(usuario.getUsuario(), usuario.getRol().getNombreRol());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("usuario", usuario.getUsuario());
        response.put("rol", usuario.getRol().getNombreRol());
        response.put("id", usuario.getId());
        response.put("nombre", usuario.getNombre());
        response.put("email", usuario.getEmail());

        return ResponseEntity.ok(response);
    }


}
