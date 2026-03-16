package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PunteoUpdateRequestDTO {
    private Long idTareaAlumno; // ID de la relación
    private Double nota;
    private String observacion;
    private LocalDate fechaEntregada;
}
