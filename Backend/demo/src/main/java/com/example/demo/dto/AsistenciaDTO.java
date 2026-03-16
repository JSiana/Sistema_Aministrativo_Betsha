package com.example.demo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Data
@Getter
@Setter
public class AsistenciaDTO {

    private Long alumnoGrupoId;
    private String descripcion;
    private LocalDate fechaAsistencia;
    private String observacion;

}
