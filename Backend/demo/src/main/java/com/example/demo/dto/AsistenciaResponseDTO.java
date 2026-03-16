package com.example.demo.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AsistenciaResponseDTO {


    private Long id;
    private String descripcion;
    private LocalDate fechaAsistencia;
    private String observacion;
    private boolean estado;

}
