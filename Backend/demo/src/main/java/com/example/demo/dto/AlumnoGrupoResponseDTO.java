package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoGrupoResponseDTO {
    private Long id;
    private String nombreCompleto;
    private String codigoPersonal;
    private String nombreCurso;
    private String codigoGrupo;
}
