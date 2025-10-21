import { Component } from '@angular/core';
import { EncargadoService } from '../../services/encargado/encargado.service';
import { EncargadoDTO, EncargadoResponse } from '../../models/encargado.model';

@Component({
  selector: 'app-encargado',
  standalone: false,
  templateUrl: './encargado.component.html',
  styleUrl: './encargado.component.scss'
})
export class EncargadoComponent {

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  encargadoSeleccionado: EncargadoDTO | null = null;

  constructor(private encargadoService: EncargadoService) { }


  abrirModalNuevo(){
    this.encargadoSeleccionado = {
      dpi: 0,
      nombres: '',
      apellidos: '',
      telefono: '',
      direccion: ''
    }
    this.mostrarModal = true;
    this.modoEdicion = true;
  }

  abrirModalVer(encargado: EncargadoResponse){
    this.encargadoService.obtenerEncargadoPorId(encargado.id).subscribe({
      next: (dto) => {
        console.log('Encargado DTO recibido: ' , dto);
        this.encargadoSeleccionado = dto;
        this.mostrarModal = true;
        this.modoEdicion = false;
      },
      error: (err) => console.error('Error al cargar encargado: ', err)
    })
  }

  activarEdicion(){
    this.modoEdicion = true;
  }

  ngOnInit(): void {
    this.cargarEncargados();
  }


  encargados: EncargadoResponse[] = [];

  cargarEncargados(): void {
    this.encargadoService.listarEncargado().subscribe({
      next: (data) => this.encargados = data,
      error: (err) => console.error('Error al cargar alumnos ', err)
    });
  }

  cerrarModal(){
    this.mostrarModal = false;
    this.encargadoSeleccionado = null;
  }


  guardarCambios(){
    
  }

}
