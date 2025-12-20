package com.example.demo.repository;

import com.example.demo.model.Alumnos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlumnoRepository extends JpaRepository<Alumnos, Long> {

    boolean existsByCodigoPersonal(String codigoPersonal);

    boolean existsByCodigoPersonalAndIdNot(String codigoPersonal, Long id);

    Optional<Alumnos> findByCodigoPersonal(String codigoPersonal);
}
