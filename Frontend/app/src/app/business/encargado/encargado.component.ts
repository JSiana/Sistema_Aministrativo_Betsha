import { Component } from '@angular/core';
import { EncargadoService } from '../../services/encargado/encargado.service';
import { EncargadoResponse } from '../../models/encargado.model';

@Component({
  selector: 'app-encargado',
  standalone: false,
  templateUrl: './encargado.component.html',
  styleUrl: './encargado.component.scss'
})
export class EncargadoComponent {

  constructor(private encargadoService: EncargadoService) { }

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

}
