import { Component } from '@angular/core';
import { GrupoResponse } from '../../models/grupo';
import { GrupoService } from '../../services/grupo/grupo.service';
import { CursoResponseDTO } from '../../models/curso';
import { CursoService } from '../../services/curso/curso.service';
import { CicloService } from '../../services/ciclo/ciclo.service';
import { AlumnoGrupoService } from '../../services/alumnoGrupo/alumno-grupo.service';
import { PunteoAlumno, Tarea } from '../../models/tarea.model';
import { TareaService } from '../../services/tarea/tarea.service';
import { TimeScale } from 'chart.js';

@Component({
  selector: 'app-tareas',
  standalone: false,
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent {

  cicloActivo!: string;
  ciclos: string[] = [];
  grupos: GrupoResponse[] = [];
  grupoSeleccionado: number | null = null;
  bimestreSeleccionado: number = 1; // Filtro Maestro

  paginaActual: number = 1;
  itemsPorPagina = 10;
  Math = Math;

  pestaniaActiva: string = 'detalles';
  tareas: Tarea[] = [];
  alumnosNotas: PunteoAlumno[] = []; // Datos de la pestaña Punteos
  tareaSeleccionadaId: number | null = null;

  nuevaTarea: Tarea = {
    descripcion: '',
    bimestre: 1,
    fechaEntrega: '',
    punteo: 0,
    idGrupo: 0
  };

  constructor(
    private grupoService: GrupoService,
    private cicloService: CicloService,
    private tareaService: TareaService
  ) { }

  ngOnInit(): void {
    this.cicloActivo = this.cicloService.getCicloActivo();
    const anioActual = new Date().getFullYear();
    this.ciclos = [];
    for (let i = anioActual - 1; i <= anioActual + 3; i++) {
      this.ciclos.push(i.toString());
    }
    this.cargarGrupos();
  }

  // --- LÓGICA DE FILTROS ---

  cambiarCiclo(ciclo: string) {
    this.cicloActivo = ciclo;
    this.cicloService.setCicloActivo(ciclo);
    this.cargarGrupos();
    this.grupoSeleccionado = null;
    this.tareas = [];
    this.alumnosNotas = [];
  }

  cargarGrupos(): void {
    this.grupoService.listarGruposPorCiclo(this.cicloActivo).subscribe({
      next: (data) => this.grupos = data,
      error: (err) => console.error('Error al cargar grupos', err)
    });
  }

  // Se dispara cuando cambia el Grupo O el Bimestre Global
  onFiltroChange() {
    this.paginaActual = 1;
    this.tareaSeleccionadaId = null;
    this.alumnosNotas = [];
    if (this.grupoSeleccionado) {
      this.cargarTareas();
    }
  }

  cargarTareas() {
    this.tareaService.listarPorGrupoYBimestre(this.grupoSeleccionado!, this.bimestreSeleccionado).subscribe({
      next: (data) => this.tareas = data,
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  // --- GESTIÓN DE NOTAS (Pestaña 2) ---

  cargarNotasDeTarea(idTarea: number) {
    this.tareaService.obtenerNotasPorTarea(idTarea).subscribe({
      next: (data) => {
        this.alumnosNotas = data;
        this.paginaActual = 1;
      },
      error: (err) => console.error('Error al cargar notas', err)
    });
  }

  guardarNotaIndividual(punteo: PunteoAlumno) {
    this.tareaService.actualizarNotasMasivo([punteo]).subscribe({
      next: () => alert('Nota guardada correctamente'),
      error: (err) => console.error('Error al guardar nota', err)
    });
  }

  // --- GESTIÓN DE TAREAS (Pestaña 1) ---

  guardarTarea() {
    if (this.grupoSeleccionado) {

      // El objeto debe tener los mismos nombres de campos que tu TareaDTO en Java
      const tareaParaEnviar = {
        descripcion: this.nuevaTarea.descripcion,
        bimestre: Number(this.bimestreSeleccionado),
        fechaEntrega: this.nuevaTarea.fechaEntrega,
        punteo: Number(this.nuevaTarea.punteo),
        idGrupo: Number(this.grupoSeleccionado)
      };

      console.log('Enviando DTO al servidor:', tareaParaEnviar);

      this.tareaService.crear(tareaParaEnviar).subscribe({
        next: (res) => {
          console.log('Respuesta del servidor:', res);
          this.tareas.push(res);
          this.limpiarFormulario();
          alert('¡Tarea guardada con éxito!');
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('Error en el servidor. Revisa los nombres de los campos.');
        }
      });
    }
  }

  limpiarFormulario() {
    this.nuevaTarea = {
      descripcion: '',
      bimestre: this.bimestreSeleccionado,
      fechaEntrega: '',
      punteo: 0,
      idGrupo: this.grupoSeleccionado || 0
    };
  }

  // --- GETTERS PAGINACIÓN ---

  get alumnosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.alumnosNotas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number[] {
    const cuenta = Math.ceil(this.alumnosNotas.length / this.itemsPorPagina);
    return Array.from({ length: cuenta || 1 }, (_, i) => i + 1);
  }

}
