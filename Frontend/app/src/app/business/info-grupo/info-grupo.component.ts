import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoService } from '../../services/grupo/grupo.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { AlumnoService } from '../../services/alumno/alumno.service';
import { AlumnoResponse } from '../../models/alumno.model';
import Swal from 'sweetalert2';
import { AlumnoGrupoService } from '../../services/alumnoGrupo/alumno-grupo.service';

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
  alumnosAsignados: any[] = [];

  /**
  * CODIGO PARA ASIGNAR ALUMNOS AL GRUPO
  */
  mostrarModalAsignar = false;

  constructor(private route: ActivatedRoute,
    private grupoService: GrupoService,
    private alumnoGrupoService: AlumnoGrupoService,
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
      error: (err) => console.error('Error al cargar grupo', err),
      complete: () => this.spinnerSvc.hide()
    });
  }


  abrirModalAsignar(): void {
    this.mostrarModalAsignar = true;
    if (this.alumnos.length === 0) {
      this.cargarAlumnos();
    }
  }

  get alumnosDisponibles(): AlumnoResponse[] {
  // CORRECCIÓN: Buscamos el ID dentro del objeto 'alumno' de la asignación
  const idsAsignados = this.alumnosAsignados.map((ag: any) => ag.alumno.id); 
  
  // Ahora sí comparamos ID de alumno contra ID de alumno
  return this.alumnos.filter(a => !idsAsignados.includes(a.id));
}

  cargarAlumnos(): void {
    this.alumnoSvc.listarAlumnos().subscribe({
      next: (data) => this.alumnos = data,
      error: (err) => console.error('Error al cargar alumnos ', err)
    });
  }

  // 🔹 Asignar alumno usando AlumnoGrupoService
 asignarAlumno(alumnoId: number): void {
  this.alumnoGrupoService.asignarAlumno(this.idGrupo, alumnoId).subscribe({
    next: () => {
      this.mostrarModalAsignar = false;
      this.cargarAlumnosAsignados(); // Esto refresca la lista y por ende los disponibles
      if (this.grupo) {
        this.grupo.cantidadAlumnos++;
      }
      Swal.fire('¡Asignado!', 'El alumno ha sido agregado al grupo', 'success');
    },
    error: (err) => console.error('Error al asignar alumno', err)
  });
}
  // 🔹 Quitar alumno usando AlumnoGrupoService
  quitarAlumno(alumnoId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El alumno será quitado del grupo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.alumnoGrupoService.quitarAlumno(this.grupo.id, alumnoId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              text: 'Alumno eliminado del grupo'
            });
            this.cargarAlumnosAsignados();
            if (this.grupo.cantidadAlumnos !== undefined) {
              this.grupo.cantidadAlumnos--;
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              text: err.error?.message || 'Error al quitar alumno'
            });
          }
        });
      }
    });
  }

  cargarAlumnosAsignados(): void {
    this.alumnoGrupoService.listarAlumnosDelGrupo(this.grupo.id).subscribe({
      next: (data) => {
        this.alumnosAsignados = data;
        this.grupo.cantidadAlumnos = this.alumnosAsignados.length; // 🔹 importante
      },
      error: (err) => console.error('Error al cargar alumnos asignados', err)
    });
  }


}
