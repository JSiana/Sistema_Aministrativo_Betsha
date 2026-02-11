package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@Setter
@Getter
@AllArgsConstructor
public class PagoResponseDTO {

    private Long id;
    private String alumnoNombre;
    private String alumnoCodigo;
    private String cursoNombre;
    private String tipoPago;
    private BigDecimal monto;
    private String mes;
    private String numeroBoleta;
    private BigDecimal mora;
    private LocalDate fechaPago;
    private BigDecimal totalPagado;
    private String ultimoMesPagado;
    private String observaciones;

}
