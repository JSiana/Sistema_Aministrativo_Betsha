import { Component, OnInit } from '@angular/core';
import { GrupoResponse } from '../../models/grupo';
import { GrupoService } from '../../services/grupo/grupo.service';
import { CursoResponseDTO } from '../../models/curso';
import { CursoService } from '../../services/curso/curso.service';
import { CicloService } from '../../services/ciclo/ciclo.service';
import { AlumnoGrupoService } from '../../services/alumnoGrupo/alumno-grupo.service';
import { PunteoAlumno, PunteoUpdateRequest, Tarea } from '../../models/tarea.model';
import { TareaService } from '../../services/tarea/tarea.service';
import { TimeScale } from 'chart.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas',
  standalone: false,
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.scss'
})
export class TareasComponent implements OnInit{

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

  totalPuntosBimestre: number = 0;

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
  // Creamos el objeto de actualización basado exactamente en lo que Java espera
  const updateRequest: PunteoUpdateRequest = {
    idTareaAlumno: punteo.idTareaAlumno, // <--- Asegúrate que este no sea undefined
    nota: punteo.nota,
    observacion: punteo.observacion || '',
    fechaEntregada: punteo.fechaEntregada
  };

  console.log('Enviando a Java:', updateRequest); // Revisa esto en la consola del navegador (F12)

  this.tareaService.actualizarNotasMasivo([updateRequest]).subscribe({
    next: () => {
      alert('Nota guardada correctamente');
      // Opcional: podrías refrescar la lista aquí
    },
    error: (err) => {
      console.error('Error al guardar nota', err);
      alert('Error al guardar la nota. Revisa la consola.');
    }
  });
}
  // --- GESTIÓN DE TAREAS (Pestaña 1) ---

  guardarTarea() {
    if (this.grupoSeleccionado) {

      if (this.totalPuntosAsignados + Number(this.nuevaTarea.punteo) > 100){
        Swal.fire({
          title: 'Limite excedido',
          text: `No puedes asignar más de 100 puntos. Espacio disponible: ${100 - this.totalPuntosAsignados} pts.`,
          icon: 'error'
        });
        return;
      }

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
          Swal.fire({
            title: 'Tarea guardada',
            text: 'La tarea ha sido creada correctamente',
            icon: 'success'
          })
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

  get totalPuntosAsignados(): number {
    return this.tareas.reduce((acc, tarea) => acc + (Number(tarea.punteo)||0),0);
  }


  // Alias para usar en la tabla de alumnos (es lo mismo que totalPuntosAsignados, 
// pero ayuda a que el HTML sea más fácil de leer)
get punteoMaximoBimestre(): number {
  return this.totalPuntosAsignados;
}

// Devuelve cuánto vale específicamente la tarea que se está calificando ahora
get punteoTareaSeleccionada(): number {
  const tarea = this.tareas.find(t => t.id == this.tareaSeleccionadaId);
  return tarea ? (Number(tarea.punteo) || 0) : 0;
}

  async eliminarTarea(id: number): Promise<void>{
    if (!id) return;
    const result = await Swal.fire({
      title: '¿Estas seguro?',
      text: 'Estas por eliminar una tarea para este grupo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed){
      this.tareaService.eliminar(id).subscribe({
        next: () => {
          this.cargarTareas();
          Swal.fire({
            icon: 'success',
            text: 'Tarea eliminada'
          })
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }



}
