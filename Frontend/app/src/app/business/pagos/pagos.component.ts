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

  cicloActivo: string ="";
  ciclos: string[] = [];
  grupos: GrupoResponse[] = [];
  grupoSeleccionado: number | null = null;
  alumnos: any[]=[];

  constructor(
    private cicloService: CicloService,
    private grupoService: GrupoService,
    private alumnoGrupoService: AlumnoGrupoService
  ) {

  }


  ngOnInit(): void {


    const anioActual = new Date().getFullYear();
    this.ciclos = [];

    for (let i = anioActual - 1; i <= anioActual + 3; i++) {
      this.ciclos.push(i.toString());
    }


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
  if (!grupoId) {
    this.alumnos = []; // Limpiar si no hay grupo
    return;
  }

  this.alumnoGrupoService.listarAlumnosDelGrupo(grupoId).subscribe({
    next: (data) => this.alumnos = data,
    error: () => this.alumnos = []
  });
}


}
