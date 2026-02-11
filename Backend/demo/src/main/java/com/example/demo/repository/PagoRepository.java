package com.example.demo.repository;

import com.example.demo.model.Pagos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pagos, Long> {

    List<Pagos> findByAlumnoGrupoId(Long alumnoGrupoId);

    boolean existsByAlumnoGrupoIdAndMes(Long alumnoGrupoId, String mes);

    List<Pagos> findByNumeroBoleta(String numeroBoleta);

    Pagos findFirstByAlumnoGrupoIdOrderByIdDesc(Long alumnoGrupoId);

}
