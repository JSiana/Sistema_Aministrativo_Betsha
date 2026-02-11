package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    @PrePersist
    protected void onCreate(){
        this.fechaPago = LocalDate.now();
    }

}
