package com.example.demo.repository;

import com.example.demo.model.Tareas;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tareas, Long> {

    List<Tareas> findByGrupoIdAndBimestre(Long grupoId, Integer bimestre);

}
