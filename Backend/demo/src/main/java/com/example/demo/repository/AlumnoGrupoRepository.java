package com.example.demo.repository;

import com.example.demo.model.AlumnoGrupo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlumnoGrupoRepository extends JpaRepository<AlumnoGrupo, Long> {

    // Contar cuántos alumnos están asignados a un grupo
    int countByGrupoId(Long grupoId);

    // Verificar si existe al menos un alumno asignado a un grupo
    boolean existsByGrupoId(Long grupoId);

    List<AlumnoGrupo> findByGrupoId(Long grupoId);
    List<AlumnoGrupo> findByAlumnoId(Long alumnoId);
}
