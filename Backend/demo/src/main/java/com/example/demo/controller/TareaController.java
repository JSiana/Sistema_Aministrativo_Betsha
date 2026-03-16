package com.example.demo.controller;

import com.example.demo.dto.TareaDTO;
import com.example.demo.dto.TareaResponseDTO;
import com.example.demo.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @PostMapping("/crear")
    public ResponseEntity<TareaResponseDTO> crear(@RequestBody TareaDTO dto) {
        // Al crear la tarea, el service generará automáticamente las notas en 0
        return new ResponseEntity<>(tareaService.crearTareaConPunteos(dto), HttpStatus.CREATED);
    }

    @GetMapping("/grupo/{idGrupo}/bimestre/{bimestre}")
    public ResponseEntity<List<TareaResponseDTO>> listar(@PathVariable Long idGrupo, @PathVariable Integer bimestre) {
        return ResponseEntity.ok(tareaService.listarTareasPorGrupoYBimestre(idGrupo, bimestre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tareaService.eliminarTarea(id);
        return ResponseEntity.noContent().build();
    }
}
