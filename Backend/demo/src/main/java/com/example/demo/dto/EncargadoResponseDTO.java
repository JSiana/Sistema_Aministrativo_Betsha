package com.example.demo.dto;

import com.example.demo.model.Encargados;

public class EncargadoResponseDTO {

    private Long id;
    private String dpi;
    private String nombres;
    private String apellidos;
    private String telefono;
    private String direccion;
    private Boolean estado;


    public EncargadoResponseDTO() {
    }

    public EncargadoResponseDTO(Long id, String dpi, String nombres, String apellidos, String telefono, String direccion, Boolean estado) {
        this.id = id;
        this.dpi = dpi;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.direccion = direccion;
        this.estado = estado;
    }

    public EncargadoResponseDTO(Encargados encargado) {
        this.id = encargado.getId();
        this.dpi = encargado.getDpi();
        this.nombres = encargado.getNombres();
        this.apellidos = encargado.getApellidos();
        this.telefono = encargado.getTelefono();
        this.direccion = encargado.getDireccion();
        this.estado = encargado.getEstado();
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getDpi() {
        return dpi;
    }

    public void setDpi(String dpi) {
        this.dpi = dpi;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
