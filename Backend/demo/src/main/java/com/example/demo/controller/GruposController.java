package com.example.demo.controller;


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

    // 🔹 Crear grupo
    @PostMapping
    public ResponseEntity<Grupos> crearGrupo(@RequestBody GrupoDTO dto) {
        Grupos grupo = grupoService.crearGrupo(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(grupo);
    }

    // 🔹 Listar grupos
    @GetMapping
    public ResponseEntity<List<GrupoResponseDTO>> listarGrupos() {
        return ResponseEntity.ok(grupoService.listarGrupo());
    }

}
