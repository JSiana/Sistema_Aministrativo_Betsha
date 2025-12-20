import { Component, OnInit } from '@angular/core';
import { AlumnoDTO, AlumnoResponse } from '../../models/alumno.model';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoService } from '../../services/alumno/alumno.service';
import { EncargadoService } from '../../services/encargado/encargado.service';
import { EncargadoDTO, EncargadoResponse } from '../../models/encargado.model';
import Swal from 'sweetalert2';
import { SequenceError } from 'rxjs';


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
  alumnoSeleccionado: AlumnoDTO = this.crearAlumnoVacio();
  modoEdicion: boolean = false;
  encargados: EncargadoResponse[] = [];
  encargadoSeleccionadoId: number | null = null;


  /**
   * Crear un objeto vacio para inicializar
   */
  private crearAlumnoVacio(): AlumnoDTO {
    return {
      codigoPersonal: '',
      primerNombre: '',
      segundoNombre: '',
      tercerNombre: '',
      primerApellido: '',
      segundoApellido: '',
      email: '',
      fechaNacimiento: '',
      sexo: null,
      ultimoGrado: '',
      telefono: '',
      estado: true,
      idEncargado: null
    };
  }


  abrirModalNuevo() {
    this.alumnoSeleccionado = this.crearAlumnoVacio();
    this.mostrarModal = true;
    this.modoEdicion = true;
  }




  alumnos: AlumnoResponse[] = [];

  constructor(
    private dialog: MatDialog,
    private alumnoService: AlumnoService,
    private encargadoService: EncargadoService
  ) {

  }

  /**
   * Metodo para cargar encargados dentro del modal en un select
   */
  cargarEncargados(): void {
    this.encargadoService.listarEncargado().subscribe({
      next: (data) => {

        // Ordenar por nombres A → Z
        this.encargados = data.sort((a: any, b: any) =>
          a.nombres.toLowerCase().localeCompare(b.nombres.toLowerCase())
        );

      },
      error: (e) => {
        console.log('Error al cargar encargados ' + e);
      }
    });
  }


  ngOnInit(): void {
    this.cargarAlumnos();
    this.cargarEncargados();
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

  async eliminarAlumno(alumno: AlumnoResponse): Promise<void> {
    if (!alumno.id) return;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que quieres eliminar a ${alumno.primerNombre} ${alumno.primerApellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      this.alumnoService.eliminarAlumno(alumno.id).subscribe({
        next: () => {
          this.cargarAlumnos();
          Swal.fire({
            icon: 'success',
            text: 'Alumno eliminado correctamente'
          });
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }


  cerrarModal() {
    this.mostrarModal = false;
    this.alumnoSeleccionado = this.crearAlumnoVacio();
  }

  guardarAlumno() {

    const { id, codigoPersonal, primerNombre, primerApellido, ultimoGrado } = this.alumnoSeleccionado;

    /**
     * Validacion para campos obligatorios
     */

    if (!codigoPersonal || !primerNombre || !primerApellido || !ultimoGrado) {
      Swal.fire({
        icon: 'warning',
        text: 'Verifique los campos obligatorios'
      });
      return;
    }


    if (!/^[A-Za-z]\d{3}[A-Za-z]{3}$/.test(codigoPersonal)) {
      Swal.fire({
        icon: 'warning',
        text: 'El código personal debe tener el formato A123ABC'
      });
      return;
    }

    if (!this.alumnoSeleccionado.idEncargado) {
      Swal.fire({
        icon: 'warning',
        text: 'Debe seleccionar a un encargado'
      })
    }

    if (id) {

      /**
       * Si tiene ID se actualiza
       */

      this.alumnoService.actualizarAlumno(id, this.alumnoSeleccionado)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              text: 'Alumno actualizado correctamente'
            });
            this.cargarAlumnos();
            this.cerrarModal();
          },
          error: (e) => {
            if (e.status === 409) {
              Swal.fire({
                icon: 'error',
                text: 'El Codigo Personal ya está registrado'
              });
            } else {
              Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error inesperado'
              });
            }
          }

        });

    } else {
      this.alumnoService.crearAlumno(this.alumnoSeleccionado).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', text: 'Alumno creado correctamente' });
          this.cargarAlumnos();
          this.cerrarModal();
        },
        error: (err) => {
          if (err.status === 409) {
            Swal.fire({
              icon: 'warning',
              text: 'El Código Personal ya está registrado'
            });

          } else if (err.status === 400) {
            Swal.fire({
              icon: 'warning',
              text: err.error?.message || 'Debe seleccionar un encargado válido'
            });

          } else {
            Swal.fire({
              icon: 'error',
              text: 'Ocurrió un error inesperado al guardar'
            });
          }
        }

      });
    }
  }



}

