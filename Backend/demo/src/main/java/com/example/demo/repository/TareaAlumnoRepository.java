package com.example.demo.repository;

import com.example.demo.model.TareaAlumnos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaAlumnoRepository extends JpaRepository<TareaAlumnos, Long> {

    List<TareaAlumnos> findByTareaId(Long tareaId);

}
