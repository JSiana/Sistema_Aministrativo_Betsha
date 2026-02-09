package com.example.demo.controller;


import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.dto.GrupoDTO;
import com.example.demo.dto.GrupoResponseDTO;
import com.example.demo.model.Grupos;
import com.example.demo.service.GrupoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
public class GruposController {

    @Autowired
    private GrupoService grupoService;

    // Crear grupo
    @PostMapping
    public ResponseEntity<Grupos> crearGrupo(@RequestBody GrupoDTO dto) {
        Grupos grupo = grupoService.crearGrupo(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(grupo);
    }

    // Listar grupos por ciclo escolar
    @GetMapping("/ciclo/{cicloEscolar}")
    public ResponseEntity<List<GrupoResponseDTO>> listarGruposPorCiclo(
            @PathVariable String cicloEscolar
    ) {
        return ResponseEntity.ok(grupoService.listarPorCiclo(cicloEscolar));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrupoResponseDTO> obtenerPorId(@PathVariable Long id) {
        GrupoResponseDTO grupo = grupoService.obtenerGrupoPorId(id);
        return ResponseEntity.ok(grupo);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarGrupo(@PathVariable Long id){
        grupoService.eliminarGrupo(id);
        return ResponseEntity.noContent().build();
    }
}
