package com.example.demo.repository;


import com.example.demo.model.Grupos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GrupoRepository extends JpaRepository<Grupos, Long> {
    boolean existsByCodigo(String codigo);

    @Query(value = """
        SELECT codigo
        FROM grupos
        WHERE codigo LIKE CONCAT('GRP-', YEAR(CURDATE()) % 100, '%')
        ORDER BY codigo DESC
        LIMIT 1
    """, nativeQuery = true)
    String findLastCodigo();


}
