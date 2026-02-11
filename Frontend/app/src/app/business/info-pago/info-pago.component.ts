import { Component, OnInit } from '@angular/core';
import { PagoDTO, PagoResponseDTO } from '../../models/pago.model';
import { ActivatedRoute } from '@angular/router';
import { PagoService } from '../../services/pago/pago.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-pago',
  standalone: false,
  templateUrl: './info-pago.component.html',
  styleUrl: './info-pago.component.scss'
})
export class InfoPagoComponent implements OnInit {
 // Información para el Banner (Viene del nuevo DTO aplanado)
  alumnoInfo: any = null;
  pagos: PagoResponseDTO[] = [];
  alumnoId!: number;
  loading: boolean = true;

  meses: string[] = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  nuevoPago: PagoDTO = {
    alumnoGrupoId: 0,
    tipoPago: '',
    monto: 0,
    mes: '',
    numeroBoleta: '',
    mora: 0,
    observaciones: ''
  };

  constructor(
    private route: ActivatedRoute,
    private pagoService: PagoService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // 1. Obtener ID de la URL
    this.alumnoId = Number(this.route.snapshot.paramMap.get('id'));
    
    // 2. Preparar el formulario con el ID actual
    this.nuevoPago.alumnoGrupoId = this.alumnoId;

    // 3. Cargar datos de ambas fuentes
    this.cargarDatosBanner();
    this.cargarHistorial();
  }

  regresar(): void {
    this.location.back();
  }

  // NUEVA FUNCIÓN: Carga los datos del alumno aunque no tenga pagos
  cargarDatosBanner(): void {
    this.pagoService.obtenerInfoBanner(this.alumnoId).subscribe({
      next: (data: any) => {
        this.alumnoInfo = data;
      },
      error: (err: any) => {
        console.error('Error al cargar datos del banner', err);
      }
    });
  }

  cargarHistorial(): void {
    this.loading = true;
    this.pagoService.obtenerHistorial(this.alumnoId).subscribe({
      next: (data: PagoResponseDTO[]) => {
        this.pagos = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar historial', err);
        this.loading = false;
      }
    });
  }

  registrarPago() {
    this.pagoService.registrarPago(this.nuevoPago).subscribe({
      next: (res) => {
        Swal.fire('Éxito', 'Pago registrado correctamente', 'success');
        this.cargarHistorial(); // Recarga la tabla de abajo
        this.limpiarFormulario();
      },
      error: (err: any) => {
        alert('Error al registrar pago: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  limpiarFormulario() {
    this.nuevoPago = {
      alumnoGrupoId: this.alumnoId,
      tipoPago: '',
      monto: 0,
      mes: '',
      numeroBoleta: '',
      mora: 0,
      observaciones: ''
    };
  }
}
