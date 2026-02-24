package com.example.demo.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Data
@Table(name = "pagos")
public class Pagos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_grupo_id", nullable = false)
    @JsonIgnoreProperties("pagos")
    private AlumnoGrupo alumnoGrupo;

    @Column(name="tipoPago",nullable = false)
    private String tipoPago;

    @Column(name = "monto", nullable = false)
    private BigDecimal monto;

    @Column(name = "mes", nullable = false)
    private String mes;


    @Column(name = "fechaPago", nullable = false)
    private LocalDate fechaPago;

    @Column(name = "numeroBoleta", nullable = false)
    private String numeroBoleta;

    @Column(name = "mora")
    private BigDecimal mora;

    @Column(name ="observaciones", length = 500)
    private String observaciones;

    @Column(name = "motivo_anulacion", length = 255)
    private String motivoAnulacion;

    @Column(name = "fecha_eliminacion")
    private LocalDateTime fechaEliminacion;

    @Column(name = "activo")
    private boolean activo = true;

    @PrePersist
    protected void onCreate(){
        this.fechaPago = LocalDate.now();
        this.activo = true;
    }

}
