package com.example.demo.repository;

import com.example.demo.model.Pagos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pagos, Long> {
    // Trae todo el historial (activos e inactivos) ordenado por fecha reciente
    List<Pagos> findByAlumnoGrupoIdOrderByFechaPagoDesc(Long alumnoGrupoId);

    // Busca boletas repetidas SOLO en pagos que estén activos
    List<Pagos> findByNumeroBoletaAndActivoTrue(String numeroBoleta);

    // Valida si ya existe una colegiatura pagada y activa para ese mes
    boolean existsByAlumnoGrupoIdAndMesAndTipoPagoAndActivoTrue(Long id, String mes, String tipo);

    List<Pagos> findByAlumnoGrupoId(Long alumnoGrupoId);

    // Buscamos el número de boleta más alto.
    // Usamos COALESCE para que si la tabla está vacía, devuelva 0.
    @Query("SELECT COALESCE(MAX(p.numeroBoleta), 0) FROM Pagos p")
    Integer findMaxNumeroBoleta();

}
