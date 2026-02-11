package com.example.demo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Data
@Getter
@Setter
public class PagoDTO {
    private Long alumnoGrupoId;
    private String tipoPago;
    private BigDecimal monto;
    private String mes;
    private String numeroBoleta;
    private BigDecimal mora;
    private String observaciones;

}
