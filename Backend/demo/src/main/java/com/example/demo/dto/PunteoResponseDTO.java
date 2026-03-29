package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PunteoResponseDTO {
    private Long idTareaAlumno;         // 1
    private String nombreAlumno;   // 2
    private String apellidoAlumno; // 3
    private Double nota;           // 4
    private Double totalAcumulado; // 5
    private String observacion;    // 6
    private LocalDate fechaEntregada; // 7
}
