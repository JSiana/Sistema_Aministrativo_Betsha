import { Component, OnInit } from '@angular/core';
import { PagoDTO, PagoResponseDTO } from '../../models/pago.model';
import { ActivatedRoute } from '@angular/router';
import { PagoService } from '../../services/pago/pago.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
  pagoParaAnularId: number | null = null;
  motivoAnulacion: string = '';

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
  ) { }

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
        Swal.fire('¡Éxito!', 'Pago registrado correctamente', 'success');
        this.cargarHistorial(); // Recarga la tabla de abajo
        this.limpiarFormulario();
      },
      error: (err: any) => {
        console.error('Status del error:', err.status); // Para monitorear en consola

        if (err.status === 409) {
          // Captura específica para duplicados (Boleta o Mes ya pagado)
          Swal.fire({
            title: 'Registro Duplicado',
            text: err.error || 'Este registro ya existe en el sistema.',
            icon: 'warning',
            confirmButtonColor: '#f8bb86',
            confirmButtonText: 'Revisar datos'
          });
        } else {
          // Error general para otros códigos (400, 500, etc.)
          Swal.fire({
            title: 'Error',
            text: err.error?.message || err.error || 'Error desconocido al registrar pago',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        }
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

  ejecutarAnulacion() {
    if (this.pagoParaAnularId && this.motivoAnulacion) {
      this.pagoService.anularPago(this.pagoParaAnularId, this.motivoAnulacion).subscribe({
        next: () => {
          this.cargarHistorial(); // La función que ya tienes para recargar la tabla
          this.motivoAnulacion = ''; // Limpiar el motivo para la próxima
          this.pagoParaAnularId = null;
        },
        error: (err) => {
          console.error(err);
          // Mostrar error (ej: Swal.fire...)
        }
      });
    }
  }


  confirmarAnulacion(id: number) {
    Swal.fire({
      title: '¿Anular este pago?',
      text: 'Debes ingresar el motivo de la anulación:',
      input: 'text', // Crea un campo de texto en la alerta
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Anular Pago',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      preConfirm: (motivo) => {
        // Validamos que el usuario escribió algo antes de permitir cerrar la alerta
        if (!motivo || motivo.trim() === "") {
          Swal.showValidationMessage('El motivo es obligatorio');
          return false;
        }
        return motivo;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamamos al servicio con el motivo capturado
        this.pagoService.anularPago(id, result.value).subscribe({
          next: () => {
            Swal.fire('¡Anulado!', 'El pago ha sido desactivado.', 'success');
            this.cargarHistorial(); // Refresca la tabla
          },
          error: (err) => {
            // Si el backend lanza el 409 Conflict, aparecerá aquí
            Swal.fire('Error', err.error || 'No se pudo anular el pago', 'error');
          }
        });
      }
    });
  }




  descargarPDF(): void {
    const doc = new jsPDF();
    const fechaDoc = new Date().toLocaleDateString();

    // 1. Encabezado del PDF
    doc.setFontSize(18);
    doc.text('Historial de Pagos de Estudiante', 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${fechaDoc}`, 14, 28);

    // 2. Información del Alumno (usando tu objeto alumnoInfo)
    if (this.alumnoInfo) {
      doc.setDrawColor(200);
      doc.line(14, 32, 196, 32); // Línea divisoria

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Estudiante: ${this.alumnoInfo.nombreCompleto}`, 14, 40);
      doc.text(`Código: ${this.alumnoInfo.codigoPersonal}`, 14, 47);
      doc.text(`Curso/Grupo: ${this.alumnoInfo.nombreCurso}`, 14, 54);

      doc.line(14, 58, 196, 58); // Otra línea
    }

    // 3. Crear la tabla de pagos
    const cuerpoTabla = this.pagos.map(pago => [
      pago.id,
      pago.tipoPago,
      pago.mes,
      `Q${pago.monto.toFixed(2)}`,
      `Q${pago.mora.toFixed(2)}`,
      pago.numeroBoleta,
      new Date(pago.fechaPago).toLocaleDateString()
    ]);

    autoTable(doc, {
      startY: 65,
      head: [['ID', 'Concepto', 'Mes', 'Monto', 'Mora', 'No. Boleta']],
      body: cuerpoTabla,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] }, // Un azul profesional
      styles: { fontSize: 9 },
    });

    // 4. Pie de página (Total acumulado)
    const totalMonto = this.pagos.reduce((acc, p) => acc + p.monto, 0);
    const finalY = (doc as any).lastAutoTable.finalY || 70;

    doc.setFontSize(12);
    doc.text(`Total Pagado a la fecha: Q${totalMonto.toFixed(2)}`, 14, finalY + 10);

    // 5. Descargar el archivo
    doc.save(`Historial_Pagos_${this.alumnoInfo?.nombreCompleto || 'Estudiante'}.pdf`);
  }


}
