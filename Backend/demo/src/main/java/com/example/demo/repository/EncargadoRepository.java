package com.example.demo.repository;

import com.example.demo.model.Encargados;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EncargadoRepository extends JpaRepository<Encargados, Long> {


    boolean existsByDpi(String dpi);

    // Verifica si existe un DPI en otro registro distinto al ID dado (para actualizar)
    boolean existsByDpiAndIdNot(String dpi, Long id);


}
