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
    this.cargarSiguienteBoleta();
  }

  regresar(): void {
    this.location.back();
  }

  cargarSiguienteBoleta(): void {
    this.pagoService.obtenerSiguienteCorrelativo().subscribe({
      next: (numero: number) => {
        // Convertimos el número a string y rellenamos con '0' a la izquierda 
        // hasta tener un total de 6 caracteres.
        this.nuevoPago.numeroBoleta = numero.toString().padStart(6, '0');

        console.log('Boleta formateada:', this.nuevoPago.numeroBoleta); // Verás "001701"
      },
      error: (err) => console.error('No se pudo cargar el correlativo', err)
    });
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
        this.cargarSiguienteBoleta();
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




  async descargarPDF() {
    const doc = new jsPDF('p', 'pt', 'a4');
    const fechaDoc = new Date().toLocaleDateString();
    const colorClaro: [number, number, number] = [0, 124, 146];
    const azulOscuro: [number, number, number] = [26, 37, 47]; 

    // 1. Función interna para cargar la imagen
    const cargarImagen = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    };

    // --- PASO CRUCIAL: Dibujar primero el fondo del encabezado ---
    doc.setFillColor(colorClaro[0], colorClaro[1], colorClaro[2]);
    doc.rect(0, 0, 600, 100, 'F');

    // --- PASO 2: Intentar poner el logo encima ---
    try {
      // Usamos la ruta que ya comprobamos que funciona
      const logo = await cargarImagen('/LOGO.png');

      // Dibujamos el logo (Asegúrate de que x=480 y y=20 esté dentro del área azul)
      // El formato 'PNG' debe coincidir con tu archivo
      doc.addImage(logo, 'PNG', 480, 20, 60, 60);
      console.log("Logo dibujado con éxito");
    } catch (error) {
      // Si falla, el PDF sigue porque ya dibujamos el fondo azul arriba
      console.warn("El logo no se pudo renderizar, continuando sin él.");
    }

    // --- PASO 3: Textos del encabezado (Encima de todo) ---
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTADO DE CUENTA / PAGOS', 40, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ACADEMIA BETSHALOM - CONTROL DE TESORERÍA', 40, 75);

    // 3. Información del Estudiante
    if (this.alumnoInfo) {
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DATOS DEL ESTUDIANTE', 40, 135);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Estudiante: ${this.alumnoInfo.nombreCompleto}`, 40, 155);
      doc.text(`Código Personal: ${this.alumnoInfo.codigoPersonal}`, 40, 170);
      doc.text(`Curso: ${this.alumnoInfo.nombreCurso}`, 40, 185);
    }

    // 4. Cuadro de Resumen de Total
    const totalMonto = this.pagos.reduce((acc, p) => acc + p.monto + (p.mora || 0), 0);

    // --- INICIO DE BLOQUE DE DISEÑO DE FICHA ---
    const boxX = 350;
    const boxY = 125;
    const boxW = 210;
    const boxH = 80;

    doc.setFillColor(245, 247, 250);
    doc.roundedRect(boxX, boxY, boxW, boxH, 8, 8, 'F');

    doc.setFillColor(232, 240, 254);
    doc.roundedRect(boxX + 10, boxY + 10, 50, 60, 5, 5, 'F');

    // DIBUJAR ICONO DE BIRRETE
    doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.triangle(boxX + 35, boxY + 25, boxX + 18, boxY + 35, boxX + 52, boxY + 35, 'F');
    doc.triangle(boxX + 35, boxY + 45, boxX + 18, boxY + 35, boxX + 52, boxY + 35, 'F');
    doc.rect(boxX + 27, boxY + 40, 16, 8, 'F');
    doc.setDrawColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.setLineWidth(1.5);
    doc.line(boxX + 52, boxY + 35, boxX + 52, boxY + 48);
    doc.circle(boxX + 52, boxY + 50, 2, 'F');

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACION DEL GRUPO', boxX + 70, boxY + 25);

    const codGrupo = this.alumnoInfo?.codigoGrupo || '0000';
    const cicloEscolar = this.alumnoInfo?.cicloEscolar || 'N/A';
    const cantidadPagos = this.pagos ? this.pagos.length : 0;

    doc.setFontSize(18);
    doc.setTextColor(59, 113, 202);
    doc.text(`GRP-${codGrupo}`, boxX + 70, boxY + 48);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ciclo Escolar: ${cicloEscolar}`, boxX + 70, boxY + 62);
    doc.text(`Registros: ${cantidadPagos} pagos realizados`, boxX + 70, boxY + 72);

    // 5. Tabla de Pagos
    const cuerpoTabla = this.pagos.map(pago => [
      pago.id,
      pago.tipoPago,
      pago.mes,
      `Q${pago.monto.toFixed(2)}`,
      `Q${(pago.mora || 0).toFixed(2)}`,
      pago.numeroBoleta ? pago.numeroBoleta.toString().padStart(6, '0') : '---'
    ]);

    autoTable(doc, {
      startY: 220,
      head: [['ID', 'CONCEPTO', 'MES', 'MONTO', 'MORA', 'NO. BOLETA']],
      body: cuerpoTabla,
      headStyles: {
        fillColor: azulOscuro,
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center'
      },
      styles: { fontSize: 8, cellPadding: 6 },
      columnStyles: {
        0: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'center' }
      }
    });

    // 6. Sección de Firma y Sello
    const bottomPosition = doc.internal.pageSize.height - 100;
    const centerX = doc.internal.pageSize.width / 2;

    doc.setDrawColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.setLineWidth(1);
    doc.line(centerX - 80, bottomPosition, centerX + 80, bottomPosition);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('F. Administración / Tesorería', centerX, bottomPosition + 15, { align: 'center' });

    // Sello
    const selloX = centerX + 110;
    const selloY = bottomPosition - 40;
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.15 }));
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('SELLO', selloX, selloY + 3, { align: 'center' });
    doc.restoreGraphicsState();

    // 7. Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Fecha de emisión: ${fechaDoc}`, 40, pageHeight - 50);
    doc.text(`Este documento es un comprobante oficial de pagos de la Academia Betshalom.`, 40, pageHeight - 40);
    doc.setTextColor(150);
    doc.text(`Documento generado automáticamente por el Sistema de Control Académico Betshalom`, 40, pageHeight - 30);

    // 8. Descargar
    const nombreArchivo = this.alumnoInfo?.nombreCompleto.replace(/\s+/g, '_') || 'Estudiante';
    doc.save(`Estado_Cuenta_${nombreArchivo}.pdf`);
  }
}
