import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../../services/grupo/grupo.service';
import { GrupoDTO, GrupoResponse } from '../../models/grupo';
import { CursoService } from '../../services/curso/curso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos',
  standalone: false,
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.scss'
})
export class GruposComponent implements OnInit {

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  grupoSeleccionado: GrupoDTO = this.crearGrupoVacio();

  private crearGrupoVacio(): GrupoDTO {
    return {
      cursoId: null,
      jornada: '',
      horario: '',
      dia: '',
    }
  }


  abrirModalNuevo() {
    this.mostrarModal = true;
    this.modoEdicion = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.grupoSeleccionado = this.crearGrupoVacio();
  }


  grupos: GrupoResponse[] = [];
  cursos: any[] = [];
  horas: string[] = [];
  horaInicio: string = '';
  horaFin: string = '';
  horasBase: string[] = [];
  diasSemana: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];
  diasSeleccionados: string[] = [];


  constructor(
    private grupoService: GrupoService,
    private cursoService: CursoService
  ) {

  }

  ngOnInit(): void {
    this.generarHoras();
    this.cargarCursos();
    this.cargarGrupos();
  }

  onJornadaChange(): void {
    this.horaInicio = '';
    this.horaFin = '';

    const jornada = this.grupoSeleccionado.jornada;

    if (jornada === 'Matutina') {
      this.horas = this.horasBase.filter(h => h >= '06:00' && h <= '13:00');
    }

    if (jornada === 'Vespertina') {
      this.horas = this.horasBase.filter(h => h >= '12:00' && h <= '18:00');
    }

    if (jornada === 'Nocturna') {
      this.horas = this.horasBase.filter(h => h >= '18:00' && h <= '22:00');
    }
  }

  generarHoras(): void {
    for (let h = 6; h <= 22; h++) {
      this.horasBase.push(`${h.toString().padStart(2, '0')}:00`);
      this.horasBase.push(`${h.toString().padStart(2, '0')}:30`);
    }
    this.horas = [...this.horasBase];
  }

  horarioValido(): boolean {
    return this.horaInicio !== '' &&
      this.horaFin !== '' &&
      this.horaInicio < this.horaFin;
  }

  onDiaChange(event: any): void {
    const dia = event.target.value;

    if (event.target.checked) {
      this.diasSeleccionados.push(dia);
    } else {
      this.diasSeleccionados =
        this.diasSeleccionados.filter(d => d !== dia);
    }

    this.grupoSeleccionado.dia = this.diasSeleccionados.join(', ');
  }

  cargarCursos(): void {
    this.cursoService.listarCursos().subscribe({
      next: (data) => {
        this.cursos = data;
      },
      error: (err) => console.error('Error cursos:', err)
    });
  }



  /**
   * Metodo para cargar los grupos
   */

  cargarGrupos(): void {
    this.grupoService.listarGrupos().subscribe({
      next: (data) => this.grupos = data,
      error: (err) => console.error('Error al cargar grupos ', err)
    });
  }



  guardarGrupo() {
    if (!this.grupoSeleccionado.cursoId || this.grupoSeleccionado.cursoId === 0) {
      Swal.fire('Error', 'Debe seleccionar un curso', 'error');
      return;
    }
    if (!this.grupoSeleccionado.jornada) {
      Swal.fire('Error', 'Debe seleccionar una jornada', 'error');
      return;
    }

    if (!this.horarioValido()) {
      Swal.fire('Error', 'Horario inválido', 'error');
      return;
    }

    if (!this.grupoSeleccionado.dia || this.grupoSeleccionado.dia.length === 0) {
      Swal.fire('Error', 'Debe seleccionar al menos un día', 'error');
      return;
    }

    this.grupoSeleccionado.horario =
      `${this.horaInicio} - ${this.horaFin}`;

    this.grupoService.crearGrupo(this.grupoSeleccionado).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Grupo creado correctamente', 'success');
        this.cerrarModal();
        this.cargarGrupos();
      },
      error: (err) => {
        if (err.status === 400) {
          Swal.fire('Error', err.error?.message || 'Datos inválidos', 'error');
        } else if (err.status === 409) {
          Swal.fire('Error', err.error?.message || 'Código duplicado', 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
        }
      }
    });


  }


  async eliminarGrupo(grupo: GrupoResponse): Promise<void>{
    if(!grupo.id) return;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que quieres eliminar el grupo ${grupo.codigo}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if(result.isConfirmed){
      this.grupoService.eliminarGrupo(grupo.id).subscribe({
        next: () => {
          this.cargarGrupos();
          Swal.fire({
            icon: 'success',
            text: 'Grupo eliminado correctamente'
          })
        },
        error: (err) => {
          if (err.status === 409){
            Swal.fire({
              icon: 'warning',
              text: err.error?.message || 'Debe eliminar los alumnos del grupo antes'
            });
          } else{
            Swal.fire({
              icon: 'error',
              text: 'Ocurrió un error inesperado'
            })
          }
        }
      })
    }

  }



}
