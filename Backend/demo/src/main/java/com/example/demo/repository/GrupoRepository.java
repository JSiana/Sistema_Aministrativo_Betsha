package com.example.demo.repository;


import com.example.demo.model.Grupos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GrupoRepository extends JpaRepository<Grupos, Long> {
    boolean existsByCodigo(String codigo);

    @Query("SELECT g.codigo FROM Grupos g ORDER BY g.id DESC LIMIT 1")
    String findLastCodigo();

}
