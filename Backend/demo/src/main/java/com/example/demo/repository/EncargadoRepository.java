package com.example.demo.repository;

import com.example.demo.model.Encargados;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EncargadoRepository extends JpaRepository<Encargados, Long> {


    boolean existsByDpi(String dpi);


}
