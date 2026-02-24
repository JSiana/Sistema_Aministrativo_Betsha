import { Component } from '@angular/core';
import { CicloService } from '../../services/ciclo/ciclo.service';
import { GrupoService } from '../../services/grupo/grupo.service';
import { GrupoResponse } from '../../models/grupo';
import { AlumnoResponse } from '../../models/alumno.model';
import { AlumnoGrupoService } from '../../services/alumnoGrupo/alumno-grupo.service';

@Component({
  selector: 'app-pagos',
  standalone: false,
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss'
})
export class PagosComponent {

  cicloActivo: string = "";
  ciclos: string[] = [];
  grupos: GrupoResponse[] = [];
  grupoSeleccionado: number | null = null;
  alumnos: any[] = [];

  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  Math = Math; // Para usar Math.min en el HTML


  constructor(
    private cicloService: CicloService,
    private grupoService: GrupoService,
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


  cargarGrupos() {
    if (!this.cicloActivo) return;

    this.grupoService
      .listarGruposPorCiclo(this.cicloActivo)
      .subscribe({
        next: (data) => this.grupos = data,
        error: () => this.grupos = []
      });
  }

  cargarAlumnos(grupoId: number) {
  // 1. Reiniciamos la página a 1 cada vez que cambiamos de grupo
  this.paginaActual = 1;

  if (!grupoId) {
    this.alumnos = []; 
    return;
  }

  this.alumnoGrupoService.listarAlumnosDelGrupo(grupoId).subscribe({
    next: (data) => {
      this.alumnos = data;
      this.paginaActual = 1;
    },
    error: () => {
      this.alumnos = [];
    }
  });
}

  get totalPaginas(): number[] {
    const cuenta = Math.ceil(this.alumnos.length / this.itemsPorPagina);
    return Array.from({ length: cuenta }, (_, i) => i + 1);
  }





}
