package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.engine.spi.ManagedEntity;


@Entity
@Table(name = "encargados")
@Getter
@Setter
public class Encargados {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La identificacion del encargado es obligatorio")
    @Pattern(regexp = "^[0-9]{13}$", message = "El DPI debe tener exactamente 13 dígitos")
    @Column(unique = true, length = 13)
    private String dpi;

    @NotBlank(message = "Los nombres es obligatorio")
    private String nombres;

    @NotBlank(message = "Los apellidos es obligatorio")
    private String apellidos;

    @NotBlank(message = "El telefono es obligatorio")
    @Pattern(regexp = "^[0-9]{8}$", message = "El teléfono debe contener exactamente 8 dígitos")
    @Column(length = 8)
    private String telefono;

    @NotBlank(message = "La direccion es obligatoria")
    private String direccion;

    @Column(name = "estado", nullable = false)
    private boolean estado = true;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDpi() {
        return dpi;
    }

    public void setDpi(String dpi) {
        this.dpi = dpi;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }
}
