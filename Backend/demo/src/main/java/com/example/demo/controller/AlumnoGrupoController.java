package com.example.demo.controller;

import com.example.demo.dto.AlumnoGrupoResponseDTO;
import com.example.demo.model.AlumnoGrupo;
import com.example.demo.service.AlumnoGrupoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumno-grupo")
public class AlumnoGrupoController {

    @Autowired
    private AlumnoGrupoService alumnoGrupoService;

    //Asignar Alumno
    @PostMapping("/{grupoId}/alumnos/{alumnoId}")
    public AlumnoGrupo asignarAlumno(@PathVariable Long grupoId, @PathVariable Long alumnoId){
        return alumnoGrupoService.asignarAlumno(grupoId, alumnoId);
    }

    // Listar alumnos por grupo
    @GetMapping("/{grupoId}/alumnos")
    public List<AlumnoGrupo> listarAlumnosPorGrupo(@PathVariable Long grupoId) {
        return alumnoGrupoService.listarAlumnosPorGrupo(grupoId);
    }

    // Listar grupos de un alumno
    @GetMapping("/alumno/{alumnoId}")
    public List<AlumnoGrupo> listarGruposPorAlumno(@PathVariable Long alumnoId) {
        return alumnoGrupoService.listarGruposPorAlumno(alumnoId);
    }

    @DeleteMapping("/{grupoId}/alumno/{alumnoId}")
    public void quitarAlumno(@PathVariable Long grupoId, @PathVariable Long alumnoId) {
        alumnoGrupoService.quitarAlumno(grupoId, alumnoId);
    }

    @GetMapping("/{id}/detalle-banner")
    public ResponseEntity<AlumnoGrupoResponseDTO> obtenerDetalleBanner(@PathVariable Long id) {
        return ResponseEntity.ok(alumnoGrupoService.obtenerDetalleBanner(id));
    }
}
