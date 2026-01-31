import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoService } from '../../services/grupo/grupo.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { AlumnoService } from '../../services/alumno/alumno.service';
import { AlumnoResponse } from '../../models/alumno.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-grupo',
  standalone: false,
  templateUrl: './info-grupo.component.html',
  styleUrl: './info-grupo.component.scss'
})
export class InfoGrupoComponent {

  idGrupo!: number;
  grupo: any = null;
  alumnos: AlumnoResponse[] = [];
  alumnosAsignados: AlumnoResponse[] = [];

  constructor(private route: ActivatedRoute,
    private grupoService: GrupoService,
    private spinnerSvc: SpinnerService,
    private alumnoSvc: AlumnoService
  ) {

  }

  ngOnInit(): void {
    this.idGrupo = Number(this.route.snapshot.paramMap.get('id'));


    if (this.idGrupo) {
      this.cargarGrupo();
      
    }
  }


  cargarGrupo(): void {
    this.spinnerSvc.show();

    this.grupoService.obtenerGrupoPorId(this.idGrupo).subscribe({
      next: (data) => {
        this.grupo = data;
        this.cargarAlumnosAsignados();
      },
      error: (err) => {
        console.error('Error al cargar grupo', err);
      },
      complete: () => {
        this.spinnerSvc.hide();
      }
    });
  }

  /**
   * CODIGO PARA ASIGNAR ALUMNOS AL GRUPO
   */
  mostrarModalAsignar = false;

  abrirModalAsignar(): void {
    this.mostrarModalAsignar = true;
    if (this.alumnos.length === 0) {
      this.cargarAlumnos();
    }
  }
 
  get alumnosDisponibles(): AlumnoResponse[]{
    const idsAsignados = this.alumnosAsignados.map(a => a.id);
    return this.alumnos.filter(a => !idsAsignados.includes(a.id));
  }

  cargarAlumnos(): void {
    this.alumnoSvc.listarAlumnos().subscribe({
      next: (data) => this.alumnos = data,
      error: (err) => console.error('Error al cargar alumnos ', err)
    })
  }

  asignarAlumno(alumnoId: number): void {
    this.grupoService.asignarAlumno(this.grupo.id, alumnoId).subscribe({
      next: () => {
        this.mostrarModalAsignar = false;
        this.grupo.cantidadAlumnos++;
        this.cargarAlumnosAsignados();
      },
      error: err => console.error('Error al asignar alumno', err)
    });
  }

  quitarAlumno(alumnoId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El alumno será quitado del grupo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        this.grupoService.quitarAlumno(this.grupo.id, alumnoId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              text: 'Alumno eliminado del grupo'
            });
            this.cargarAlumnosAsignados();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              text: err.error?.message || 'Error al quitar alumno'
            });
          }
        });
      }
    })
  }

  cargarAlumnosAsignados(): void {
    this.grupoService.listarAlumnosDelGrupo(this.grupo.id).subscribe({
      next: (data) => this.alumnosAsignados = data,
      error: (err) => console.error('Error al cargar alumnos asignados', err)
    });
  }



}
