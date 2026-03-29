package com.example.demo.controller;

import com.example.demo.dto.PunteoResponseDTO;
import com.example.demo.dto.PunteoUpdateRequestDTO;
import com.example.demo.service.TareaAlumnoService;
import com.example.demo.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas-tareas")
public class TareaAlumnoController {

    @Autowired
    private TareaAlumnoService tareaAlumnoService;

    // Obtiene la lista de alumnos con sus campos de nota, fecha y observación
    @GetMapping("/tarea/{idTarea}")
    public ResponseEntity<List<PunteoResponseDTO>> obtenerNotasPorTarea(@PathVariable Long idTarea) {
        return ResponseEntity.ok(tareaAlumnoService.listarNotasPorTarea(idTarea));
    }

    // Recibe una lista de alumnos para guardar todos los cambios de una vez
    @PutMapping("/actualizar-masivo")
// Cambiamos PunteoUpdateRequestDTO por PunteoResponseDTO
    public ResponseEntity<String> actualizarNotas(@RequestBody List<PunteoResponseDTO> dtos) {
        try {
            tareaAlumnoService.actualizarNotasMasivamente(dtos);
            return ResponseEntity.ok("Notas actualizadas correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar: " + e.getMessage());
        }
    }
}
