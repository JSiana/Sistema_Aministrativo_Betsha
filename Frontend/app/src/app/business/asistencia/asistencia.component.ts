import { Component } from '@angular/core';
import { GrupoService } from '../../services/grupo/grupo.service';
import { CursoService } from '../../services/curso/curso.service';
import { CicloService } from '../../services/ciclo/ciclo.service';
import { GrupoResponse } from '../../models/grupo';
import { AlumnoGrupoService } from '../../services/alumnoGrupo/alumno-grupo.service';

@Component({
  selector: 'app-asistencia',
  standalone: false,
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent {

  cicloActivo!: string;
  ciclos: string[] = [];
  grupos: GrupoResponse[] = [];
  grupoSeleccionado: number | null = null;
  paginaActual: number = 1;
  itemsPorPagina = 10;
  Math = Math;
  alumnos: any[] = [];


  constructor(
    private grupoService: GrupoService,
    private cursoService: CursoService,
    private cicloService: CicloService,
    private alumnoGrupoService: AlumnoGrupoService

  ) {

  }


  ngOnInit(): void {
    this.cicloActivo = this.cicloService.getCicloActivo();
    const anioActual = new Date().getFullYear();
    this.ciclos = [];

    for (let i = anioActual - 1; i <= anioActual + 3; i++) {
      this.ciclos.push(i.toString());
    }
    this.cicloActivo = this.cicloService.getCicloActivo();

    this.cargarGrupos();

  }


  cambiarCiclo(ciclo: string) {
    this.cicloActivo = ciclo;
    this.cicloService.setCicloActivo(ciclo);
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.grupoService
      .listarGruposPorCiclo(this.cicloActivo)
      .subscribe({
        next: (data) => this.grupos = data,
        error: (err) => console.error('Error al cargar grupos', err)
      });
  }


  cargarAlumnos(grupoId: number) {
    this.paginaActual = 1;

    if (!grupoId) {
      this.alumnos = [];
      return;
    }

    this.alumnoGrupoService.listarAlumnosDelGrupo(grupoId).subscribe({
      next: (data: any[]) => {
        this.alumnos = data.sort((a, b) => {
          const fullA = `${a.alumno?.primerApellido || ''} ${a.alumno?.segundoApellido || ''} ${a.alumno?.primerNombre || ''}`.toLowerCase().trim();
          const fullB = `${b.alumno?.primerApellido || ''} ${b.alumno?.segundoApellido || ''} ${b.alumno?.primerNombre || ''}`.toLowerCase().trim();

          // localeCompare resuelve el orden alfabético correctamente
          return fullA.localeCompare(fullB);
        });

        this.paginaActual = 1;
      },
      error: () => {
        this.alumnos = [];
      }
    });

  }

  get totalPaginas(): number[] {
    const cuenta = this.Math.ceil(this.alumnos.length / this.itemsPorPagina);
    return Array.from({ length: cuenta }, (_, i) => i + 1);
  }


}
