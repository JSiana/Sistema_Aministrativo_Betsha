import { Component, OnInit } from '@angular/core';
import { AlumnoDTO, AlumnoResponse } from '../../models/alumno.model';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoService } from '../../services/alumno/alumno.service';

export interface ResultadoAlumnoModal {
  guardado: boolean;
  alumno: AlumnoDTO;
}

@Component({
  selector: 'app-alumnos',
  standalone: false,
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.scss'
})
export class AlumnosComponent implements OnInit {

  mostrarModal: boolean = false;
  alumnoSeleccionado: AlumnoDTO | null = null;
  modoEdicion: boolean = false;


  abrirModalNuevo() {
    this.alumnoSeleccionado = {
      codigoPersonal: '',
      primerNombre: '',
      segundoNombre: '',
      tercerNombre: '',
      primerApellido: '',
      segundoApellido: '',
      email: '',
      fechaNacimiento: '',
      ultimoGrado: '',
      telefono: '',
      estado: true,
      idEncargado: 0,
      nombreEncargado: '',
      apellidoEncargado: ''
    };
    this.mostrarModal = true;
    this.modoEdicion = true;
  }




  alumnos: AlumnoResponse[] = [];

  constructor(private dialog: MatDialog, private alumnoService: AlumnoService) { }

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnoService.listarAlumnos().subscribe({
      next: (data) => this.alumnos = data,
      error: (err) => console.error('Error al cargar alumnos', err)
    });
  }


  abrirModalVer(alumno: AlumnoResponse) {

    this.alumnoService.obtenerAlumnoPorId(alumno.id).subscribe({
      next: (dto) => {
        console.log('Alumno DTO recibido:', dto);
        this.alumnoSeleccionado = dto;
        this.mostrarModal = true;
        this.modoEdicion = false;
      },
      error: (err) => console.error('Error al cargar alumno', err)
    });
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  eliminarAlumno(alumno: AlumnoResponse): void {
    if (!alumno.id) return;
    const confirmado = confirm(`¿Seguro de eliminar a ${alumno.primerNombre} ${alumno.primerApellido}?`);
    if (confirmado) {
      this.alumnoService.eliminarAlumno(alumno.id).subscribe({
        next: () => this.cargarAlumnos(),
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }


  cerrarModal() {
    this.mostrarModal = false;
    this.alumnoSeleccionado = null;
  }

  guardarCambios() {
   
  }

}

