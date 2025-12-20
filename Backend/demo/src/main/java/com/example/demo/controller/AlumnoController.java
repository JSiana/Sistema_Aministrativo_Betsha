package com.example.demo.controller;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.model.Alumnos;
import com.example.demo.service.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    private final  AlumnoService alumnoService;

    public AlumnoController(AlumnoService alumnoService){
        this.alumnoService = alumnoService;
    }

    @GetMapping
    public ResponseEntity<List<AlumnoResponseDTO>> listarAlumnos() {
        return ResponseEntity.ok(alumnoService.listarAlumnos());
    }

    @PostMapping
    public ResponseEntity<Alumnos> crearAlumno(@RequestBody AlumnoDTO dto){
        Alumnos alumno = alumnoService.guardarAlumno(dto);
        return ResponseEntity.ok(alumno);
    }


    @GetMapping("/{id}")
    public AlumnoDTO obtenerAlumnoPorId(@PathVariable Long id) {
        return alumnoService.obtenerAlumnoPorId(id);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<AlumnoResponseDTO> actualizarAlumno(
            @PathVariable Long id,
            @RequestBody AlumnoDTO dto
    ){
        AlumnoResponseDTO response = alumnoService.actualizarAlumno(id,dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAlumno(@PathVariable Long id){
        alumnoService.eliminarAlumno(id);
        return ResponseEntity.noContent().build();
    }


}
