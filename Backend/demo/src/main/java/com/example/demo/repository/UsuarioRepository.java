package com.example.demo.repository;

import com.example.demo.model.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuarios, Long> {

boolean existsByUsuario(String usuario);
boolean existsByEmail(String email);


    Optional<Usuarios> findByUsuario(String usuario);


}
