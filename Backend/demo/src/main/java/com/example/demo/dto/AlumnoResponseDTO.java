package com.example.demo.dto;

import com.example.demo.model.Alumnos;

import java.time.LocalDate;

public class AlumnoResponseDTO {

    private Long id;
    private String codigoPersonal;
    private String primerNombre;
    private String segundoNombre;
    private String tercerNombre;
    private String primerApellido;
    private String segundoApellido;
    private String nombreEncargado;
    private String apellidoEncargado;
    private String sexo;
    private String telefono;
    private Boolean estado;

    public AlumnoResponseDTO() {
    }

    public AlumnoResponseDTO(Long id, String codigoPersonal, String primerNombre, String segundoNombre, String tercerNombre, String primerApellido, String segundoApellido, String nombreEncargado, String apellidoEncargado, String sexo, String telefono, Boolean estado) {
        this.id = id;
        this.codigoPersonal = codigoPersonal;
        this.primerNombre = primerNombre;
        this.segundoNombre = segundoNombre;
        this.tercerNombre = tercerNombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.nombreEncargado = nombreEncargado;
        this.apellidoEncargado = apellidoEncargado;
        this.sexo = sexo;
        this.telefono = telefono;
        this.estado = estado;
    }

    public AlumnoResponseDTO(Alumnos alumno){
        this.id = alumno.getId();
        this.codigoPersonal = alumno.getCodigoPersonal();
        this.primerNombre = alumno.getPrimerNombre();
        this.segundoNombre = alumno.getSegundoNombre();
        this.tercerNombre = alumno.getTercerNombre();
        this.primerApellido = alumno.getPrimerApellido();
        this.segundoApellido = alumno.getSegundoApellido();
        this.sexo = alumno.getSexo();
        this.telefono = alumno.getTelefono();
        this.estado = alumno.getEstado();

        if (alumno.getEncargado() != null) {
            this.nombreEncargado = alumno.getEncargado().getNombres();
            this.apellidoEncargado = alumno.getEncargado().getApellidos();
        }
    }


    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getSexo() {
        return sexo;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigoPersonal() {
        return codigoPersonal;
    }

    public void setCodigoPersonal(String codigoPersonal) {
        this.codigoPersonal = codigoPersonal;
    }

    public String getPrimerNombre() {
        return primerNombre;
    }

    public void setPrimerNombre(String primerNombre) {
        this.primerNombre = primerNombre;
    }

    public String getSegundoNombre() {
        return segundoNombre;
    }

    public void setSegundoNombre(String segundoNombre) {
        this.segundoNombre = segundoNombre;
    }

    public String getTercerNombre() {
        return tercerNombre;
    }

    public void setTercerNombre(String tercerNombre) {
        this.tercerNombre = tercerNombre;
    }

    public String getPrimerApellido() {
        return primerApellido;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return segundoApellido;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public String getNombreEncargado() {
        return nombreEncargado;
    }

    public void setNombreEncargado(String nombreEncargado) {
        this.nombreEncargado = nombreEncargado;
    }

    public String getApellidoEncargado() {
        return apellidoEncargado;
    }

    public void setApellidoEncargado(String apellidoEncargado) {
        this.apellidoEncargado = apellidoEncargado;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
