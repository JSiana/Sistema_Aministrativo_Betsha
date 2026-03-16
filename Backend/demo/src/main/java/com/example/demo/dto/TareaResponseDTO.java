package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TareaResponseDTO {
    private Long id;
    private String descripcion;
    private Integer bimestre;
    private LocalDate fechaEntrega;
    private Integer punteo;
}
