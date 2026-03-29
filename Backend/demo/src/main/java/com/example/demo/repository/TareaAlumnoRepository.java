package com.example.demo.repository;

import com.example.demo.dto.PunteoResponseDTO;
import com.example.demo.model.TareaAlumnos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TareaAlumnoRepository extends JpaRepository<TareaAlumnos, Long> {

    List<TareaAlumnos> findByTareaId(Long tareaId);

    @Query("SELECT new com.example.demo.dto.PunteoResponseDTO(" +
            "ta.alumno.id, " +                                // 1
            "ta.alumno.primerNombre, " +                      // 2
            "ta.alumno.primerApellido, " +                    // 3
            "ta.nota, " +                                     // 4
            "(SELECT SUM(ta2.nota) FROM TareaAlumnos ta2 " +  // 5 (Total del bimestre)
            " WHERE ta2.alumno.id = ta.alumno.id " +
            " AND ta2.tarea.grupo.id = :idGrupo " +
            " AND ta2.tarea.bimestre = :bimestre), " +
            "ta.observacion, " +                              // 6
            "ta.fechaEntregada) " +                           // 7 (Agregamos este para que sean 7)
            "FROM TareaAlumnos ta WHERE ta.tarea.id = :idTarea")
    List<PunteoResponseDTO> findNotasConTotales(
            @Param("idTarea") Long idTarea,
            @Param("idGrupo") Long idGrupo,
            @Param("bimestre") Integer bimestre
    );

}
