package com.example.demo.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
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
    private String motivoAnulacion;
    private LocalDateTime fechaEliminacion;
    private boolean activo;

}
