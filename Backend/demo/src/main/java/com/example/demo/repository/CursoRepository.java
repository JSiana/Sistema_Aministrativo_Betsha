package com.example.demo.repository;

import com.example.demo.model.Cursos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Cursos, Long> {
    boolean existsByNombre(String nombre);
}
