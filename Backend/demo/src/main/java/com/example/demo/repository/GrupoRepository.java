package com.example.demo.repository;


import com.example.demo.model.Grupos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrupoRepository extends JpaRepository<Grupos, Long> {
    boolean existsByCodigo(String codigo);

}
