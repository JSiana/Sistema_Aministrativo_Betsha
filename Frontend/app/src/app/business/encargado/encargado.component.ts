import { Component } from '@angular/core';
import { EncargadoService } from '../../services/encargado/encargado.service';
import { EncargadoDTO, EncargadoResponse } from '../../models/encargado.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encargado',
  standalone: false,
  templateUrl: './encargado.component.html',
  styleUrl: './encargado.component.scss'
})
export class EncargadoComponent {

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  encargadoSeleccionado: EncargadoDTO = this.crearEncargadoVacio();

  constructor(private encargadoService: EncargadoService) { }

  ngOnInit(): void {
    this.cargarEncargados();
  }

  // Crear un objeto vacio para inicializar
  private crearEncargadoVacio(): EncargadoDTO {
    return {
      dpi: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      direccion: ''
    }
  }

  abrirModalNuevo() {
    this.encargadoSeleccionado = this.crearEncargadoVacio();

    this.mostrarModal = true;
    this.modoEdicion = true;
  }

  abrirModalVer(encargado: EncargadoResponse) {
    this.encargadoService.obtenerEncargadoPorId(encargado.id).subscribe({
      next: (dto) => {
        console.log('Encargado DTO recibido: ', dto);
        this.encargadoSeleccionado = dto;
        this.mostrarModal = true;
        this.modoEdicion = false;
      },
      error: (err) => console.error('Error al cargar encargado: ', err)
    })
  }

  activarEdicion() {
    this.modoEdicion = true;
  }


  encargados: EncargadoResponse[] = [];

  cargarEncargados(): void {
    this.encargadoService.listarEncargado().subscribe({
      next: (data) => this.encargados = data,
      error: (err) => console.error('Error al cargar alumnos ', err)
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.encargadoSeleccionado = this.crearEncargadoVacio();
  }

guardarEncargado(): void {
  const { id, dpi, nombres, apellidos, telefono, direccion } = this.encargadoSeleccionado;

  // Validación de campos obligatorios
  if (!dpi || !nombres || !apellidos || !telefono || !direccion) {
    Swal.fire({ icon: 'warning', text: 'Todos los campos son obligatorios' });
    return;
  }
    if (!/^\d{13}$/.test(dpi)) {
    Swal.fire({ icon: 'warning', text: 'El DPI debe tener exactamente 13 dígitos' });
    return;
  }

  if (!/^\d{8}$/.test(telefono)) {
    Swal.fire({ icon: 'warning', text: 'El teléfono debe tener exactamente 8 dígitos' });
    return;
  }

  // 🔹 Aquí agregamos los console.log
 // console.log("Encargado a guardar:", this.encargadoSeleccionado);
  // onsole.log("ID del encargado:", id);

  if (id) {
    // Si tiene ID → actualizar
    this.encargadoService.actualizarEncargado(id, this.encargadoSeleccionado)
      .subscribe({
        next: () => {
          Swal.fire({ icon: 'success', text: 'Encargado actualizado correctamente' });
          this.cargarEncargados();
          this.cerrarModal();
        },
        error: (e) => {
          if (e.status === 409) {
            Swal.fire({ icon: 'error', text: 'El DPI ya está registrado' });
          } else {
            Swal.fire({ icon: 'error', text: 'Ocurrió un error inesperado' });
          }
        }
      });
  } else {
    // Si NO tiene ID → crear
    this.encargadoService.crearEncargado(this.encargadoSeleccionado)
      .subscribe({
        next: () => {
          Swal.fire({ icon: 'success', text: 'Encargado creado correctamente' });
          this.cargarEncargados();
          this.cerrarModal();
        },
        error: (e) => {
          if (e.status === 409) {
            Swal.fire({ icon: 'error', text: 'El DPI ya está registrado' });
          } else {
            Swal.fire({ icon: 'error', text: 'Ocurrió un error inesperado' });
          }
        }
      });
  }
}





}
