package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDate;


@Data
public class PunteoResponseDTO {
    private Long idTareaAlumno;
    private String nombreAlumno;
    private String apellidoAlumno;
    private Double nota;
    private String observacion;
    private LocalDate fechaEntregada;
    private String descripcionTarea;
}
