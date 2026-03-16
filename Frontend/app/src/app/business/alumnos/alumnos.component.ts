import { Component, OnInit } from '@angular/core';
import { AlumnoDTO, AlumnoResponse } from '../../models/alumno.model';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoService } from '../../services/alumno/alumno.service';
import { EncargadoService } from '../../services/encargado/encargado.service';
import { EncargadoDTO, EncargadoResponse } from '../../models/encargado.model';
import Swal from 'sweetalert2';
import { SequenceError } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export interface ResultadoAlumnoModal {
  guardado: boolean;
  alumno: AlumnoDTO;
}

@Component({
  selector: 'app-alumnos',
  standalone: false,
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.scss'
})
export class AlumnosComponent implements OnInit {

  mostrarModal: boolean = false;
  alumnoSeleccionado: AlumnoDTO = this.crearAlumnoVacio();
  modoEdicion: boolean = false;
  encargados: EncargadoResponse[] = [];
  encargadoSeleccionadoId: number | null = null;

  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  Math = Math; // Esto es para que el HTML reconozca Math.min

  // 2. Getter para generar el arreglo de páginas dinámicamente
  get totalPaginas(): number[] {
    const total = Math.ceil(this.alumnos.length / this.itemsPorPagina);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  /**
   * Crear un objeto vacio para inicializar
   */
  private crearAlumnoVacio(): AlumnoDTO {
    return {
      codigoPersonal: '',
      primerNombre: '',
      segundoNombre: '',
      tercerNombre: '',
      primerApellido: '',
      segundoApellido: '',
      email: '',
      fechaNacimiento: '',
      sexo: null,
      ultimoGrado: '',
      telefono: '',
      estado: true,
      idEncargado: null
    };
  }


  abrirModalNuevo() {
    this.alumnoSeleccionado = this.crearAlumnoVacio();
    this.mostrarModal = true;
    this.modoEdicion = true;
  }




  alumnos: AlumnoResponse[] = [];

  constructor(
    private dialog: MatDialog,
    private alumnoService: AlumnoService,
    private encargadoService: EncargadoService
  ) {

  }

  /**
   * Metodo para cargar encargados dentro del modal en un select
   */
  cargarEncargados(): void {
    this.encargadoService.listarEncargado().subscribe({
      next: (data) => {

        // Ordenar por nombres A → Z
        this.encargados = data.sort((a: any, b: any) =>
          a.nombres.toLowerCase().localeCompare(b.nombres.toLowerCase())
        );

      },
      error: (e) => {
        console.log('Error al cargar encargados ' + e);
      }
    });
  }


  ngOnInit(): void {
    this.cargarAlumnos();
    this.cargarEncargados();
  }

  cargarAlumnos(): void {
    this.alumnoService.listarAlumnos().subscribe({
      next: (data) => this.alumnos = data,
      error: (err) => console.error('Error al cargar alumnos', err)
    });
  }


  abrirModalVer(alumno: AlumnoResponse) {

    this.alumnoService.obtenerAlumnoPorId(alumno.id).subscribe({
      next: (dto) => {
        console.log('Alumno DTO recibido:', dto);
        this.alumnoSeleccionado = dto;
        this.mostrarModal = true;
        this.modoEdicion = false;
      },
      error: (err) => console.error('Error al cargar alumno', err)
    });
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  async eliminarAlumno(alumno: AlumnoResponse): Promise<void> {
    if (!alumno.id) return;

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que quieres eliminar a ${alumno.primerNombre} ${alumno.primerApellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      this.alumnoService.eliminarAlumno(alumno.id).subscribe({
        next: () => {
          this.cargarAlumnos();
          Swal.fire({
            icon: 'success',
            text: 'Alumno eliminado correctamente'
          });
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }


  cerrarModal() {
    this.mostrarModal = false;
    this.alumnoSeleccionado = this.crearAlumnoVacio();
  }

  guardarAlumno() {

    const { id, codigoPersonal, primerNombre, primerApellido, ultimoGrado } = this.alumnoSeleccionado;

    /**
     * Validacion para campos obligatorios
     */

    if (!codigoPersonal || !primerNombre || !primerApellido || !ultimoGrado) {
      Swal.fire({
        icon: 'warning',
        text: 'Verifique los campos obligatorios'
      });
      return;
    }


    if (!/^[A-Za-z]\d{3}[A-Za-z]{3}$/.test(codigoPersonal)) {
      Swal.fire({
        icon: 'warning',
        text: 'El código personal debe tener el formato A123ABC'
      });
      return;
    }

    if (!this.alumnoSeleccionado.idEncargado) {
      Swal.fire({
        icon: 'warning',
        text: 'Debe seleccionar a un encargado'
      })
    }

    if (id) {

      /**
       * Si tiene ID se actualiza
       */

      this.alumnoService.actualizarAlumno(id, this.alumnoSeleccionado)
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              text: 'Alumno actualizado correctamente'
            });
            this.cargarAlumnos();
            this.cerrarModal();
          },
          error: (e) => {
            if (e.status === 409) {
              Swal.fire({
                icon: 'error',
                text: 'El Codigo Personal ya está registrado'
              });
            } else {
              Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error inesperado'
              });
            }
          }

        });

    } else {
      this.alumnoService.crearAlumno(this.alumnoSeleccionado).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', text: 'Alumno creado correctamente' });
          this.cargarAlumnos();
          this.cerrarModal();
        },
        error: (err) => {
          if (err.status === 409) {
            Swal.fire({
              icon: 'warning',
              text: 'El Código Personal ya está registrado'
            });

          } else if (err.status === 400) {
            Swal.fire({
              icon: 'warning',
              text: err.error?.message || 'Debe seleccionar un encargado válido'
            });

          } else {
            Swal.fire({
              icon: 'error',
              text: 'Ocurrió un error inesperado al guardar'
            });
          }
        }

      });
    }
  }

  async descargarPDF() {
    if (this.alumnos.length === 0) return;

    const doc = new jsPDF('p', 'pt', 'a4');
    const fechaDoc = new Date().toLocaleDateString();
    const azulInstitucional: [number, number, number] = [0, 124, 146]; // #007c92

    // Función para cargar el logo
    const cargarImagen = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
      });
    };

    try {
      // 1. Encabezado con Fondo Azul
      doc.setFillColor(...azulInstitucional);
      doc.rect(0, 0, 600, 100, 'F');

      // Logo
      const logo = await cargarImagen('/LOGO.png');
      doc.addImage(logo, 'PNG', 480, 20, 60, 60);
    } catch (error) {
      console.warn("Logo no cargado");
      doc.setFillColor(...azulInstitucional);
      doc.rect(0, 0, 600, 100, 'F');
    }

    // Textos del Encabezado
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LISTADO GENERAL DE ALUMNOS', 40, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ACADEMIA BETSHALOM - CONTROL DE EXPEDIENTES', 40, 75);

    // 2. Resumen Estadístico (Cuadro Gris)
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(40, 120, 515, 45, 8, 8, 'F');

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de Alumnos Registrados:`, 60, 147);

    doc.setTextColor(azulInstitucional[0], azulInstitucional[1], azulInstitucional[2]);
    doc.setFontSize(14);
    doc.text(`${this.alumnos.length}`, 215, 147);

    // 3. Preparación de Datos para la Tabla
    // Mapeamos los datos para que coincidan con las columnas
    const cuerpoTabla = this.alumnos.map((alumno, index) => [
      index + 1,
      alumno.codigoPersonal,
      `${alumno.primerApellido} ${alumno.segundoApellido}, ${alumno.primerNombre} ${alumno.segundoNombre}`,
      alumno.sexo || 'N/A',
      alumno.estado ? 'ACTIVO' : 'INACTIVO'
    ]);

    // 4. Generación de Tabla
    autoTable(doc, {
      startY: 180,
      head: [['#', 'CÓDIGO', 'NOMBRE COMPLETO', 'GÉNERO', 'ESTADO']],
      body: cuerpoTabla,
      headStyles: {
        fillColor: azulInstitucional,
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 6
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 30 },
        1: { halign: 'center', cellWidth: 80 },
        3: { halign: 'center', cellWidth: 70 },
        4: { halign: 'center', cellWidth: 70 }
      },
      // Estilo condicional para el estado
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 4) {
          const estado = data.cell.raw;
          if (estado === 'ACTIVO') {
            data.cell.styles.textColor = [34, 153, 84]; // Verde
          } else {
            data.cell.styles.textColor = [203, 67, 53]; // Rojo
          }
        }
      }
    });

    // 5. Pie de Página
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${pageCount} | Generado el: ${fechaDoc} - Academia Betshalom`,
        40,
        doc.internal.pageSize.height - 20
      );
    }

    // 6. Descarga
    doc.save(`Listado_General_Alumnos_${new Date().getTime()}.pdf`);
  }


}

