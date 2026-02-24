import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GrupoService } from '../../services/grupo/grupo.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { AlumnoService } from '../../services/alumno/alumno.service';
import { AlumnoResponse } from '../../models/alumno.model';
import Swal from 'sweetalert2';
import { AlumnoGrupoService } from '../../services/alumnoGrupo/alumno-grupo.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-info-grupo',
  standalone: false,
  templateUrl: './info-grupo.component.html',
  styleUrl: './info-grupo.component.scss'
})
export class InfoGrupoComponent {


  idGrupo!: number;
  grupo: any = null;
  alumnos: AlumnoResponse[] = [];
  alumnosAsignados: any[] = [];

  // Variables para el Modal y Buscador
  mostrarModalAsignar = false;
  filtroBusqueda: string = '';
  alumnosFiltrados: AlumnoResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private grupoService: GrupoService,
    private alumnoGrupoService: AlumnoGrupoService,
    private spinnerSvc: SpinnerService,
    private alumnoSvc: AlumnoService
  ) { }

  ngOnInit(): void {
    this.idGrupo = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idGrupo) {
      this.cargarGrupo();
    }
  }

  cargarGrupo(): void {
    this.spinnerSvc.show();
    this.grupoService.obtenerGrupoPorId(this.idGrupo).subscribe({
      next: (data) => {
        this.grupo = data;
        this.cargarAlumnosAsignados();
      },
      error: (err) => console.error('Error al cargar grupo', err),
      complete: () => this.spinnerSvc.hide()
    });
  }

  abrirModalAsignar(): void {
    this.mostrarModalAsignar = true;
    this.filtroBusqueda = ''; // Limpiar búsqueda previa
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnoSvc.listarAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
        this.aplicarFiltro(); // Inicializa la lista filtrada
      },
      error: (err) => console.error('Error al cargar alumnos ', err)
    });
  }

  // --- Lógica del buscador ---
  aplicarFiltro(): void {
    const busqueda = this.filtroBusqueda.toLowerCase().trim();
    const idsAsignados = this.alumnosAsignados.map((ag: any) => ag.alumno.id);

    // Filtramos los que no están en el grupo
    const disponibles = this.alumnos.filter(a => !idsAsignados.includes(a.id));

    if (!busqueda) {
      this.alumnosFiltrados = disponibles;
    } else {
      this.alumnosFiltrados = disponibles.filter(a => {
        const nombreCompleto = `${a.primerNombre} ${a.segundoNombre || ''} ${a.primerApellido} ${a.segundoApellido || ''}`.toLowerCase();
        return nombreCompleto.includes(busqueda) || a.codigoPersonal.toLowerCase().includes(busqueda);
      });
    }
  }

  asignarAlumno(alumnoId: number): void {
    this.alumnoGrupoService.asignarAlumno(this.idGrupo, alumnoId).subscribe({
      next: () => {
        this.cargarAlumnosAsignados();
        // Feedback visual inmediato
        this.alumnosFiltrados = this.alumnosFiltrados.filter(a => a.id !== alumnoId);
        Swal.fire({ icon: 'success', title: '¡Asignado!', timer: 1000, showConfirmButton: false });
      },
      error: (err) => console.error('Error al asignar alumno', err)
    });
  }

  quitarAlumno(alumnoId: number): void {
    Swal.fire({
      title: '¿Quitar alumno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.alumnoGrupoService.quitarAlumno(this.idGrupo, alumnoId).subscribe({
          next: () => {
            this.cargarAlumnosAsignados();
            Swal.fire('Listo', 'Alumno removido', 'success');
          }
        });
      }
    });
  }

  cargarAlumnosAsignados(): void {
    this.alumnoGrupoService.listarAlumnosDelGrupo(this.idGrupo).subscribe({
      next: (data) => {
        this.alumnosAsignados = data;
        if (this.grupo) this.grupo.cantidadAlumnos = this.alumnosAsignados.length;
      }
    });
  }


  descargarPDF() {
    if (!this.grupo) return;

    const doc = new jsPDF('p', 'pt', 'a4');

    // Colores institucionales (Azul y Gris)
    const azulOscuro: [number, number, number] = [26, 37, 47];
    const grisClaro: [number, number, number] = [245, 245, 245];

    // 1. Encabezado Institucional (Academia Betshalom)
    doc.setFillColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.rect(0, 0, 600, 100, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE ACADÉMICO DE GRUPO', 40, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ACADEMIA BETSHALOM - REGISTRO DE CALIFICACIONES', 40, 75);

    // 2. Información del Grupo (Arriba de la tabla)
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CURSO', 40, 135);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Curso: ${this.grupo.curso}`, 40, 155);
    doc.text(`Código: ${this.grupo.codigo}`, 40, 170);
    doc.text(`Jornada: ${this.grupo.jornada}`, 40, 185);
    doc.text(`Día y Horario: ${this.grupo.dia} - ${this.grupo.horario}`, 40, 200);

    // 3. Resumen de cantidad de alumnos
    doc.setFillColor(grisClaro[0], grisClaro[1], grisClaro[2]);
    doc.roundedRect(380, 125, 170, 70, 5, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('ALUMNOS INSCRITOS', 400, 150);
    doc.setFontSize(18);
    doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
    doc.text(`${this.alumnosAsignados.length}`, 400, 175);

    // 4. Tabla de Alumnos y Notas
    // Usamos 'alumnosAsignados' para llenar la tabla
    const cuerpoTabla = this.alumnosAsignados.map((asig: any, index: number) => [
      index + 1,
      asig.alumno?.codigoPersonal || '---',
      `${asig.alumno?.primerNombre || ''} ${asig.alumno?.segundoNombre || ''} ${asig.alumno?.primerApellido || ''} ${asig.alumno?.segundoApellido || ''}`,
      '---', // Espacio para Notas (según tu HTML actual)
      '---'  // Espacio para Promedio (según tu HTML actual)
    ]);

    autoTable(doc, {
      startY: 230,
      head: [['#', 'CÓDIGO', 'NOMBRE COMPLETO', 'NOTAS', 'PROMEDIO']],
      body: cuerpoTabla,
      headStyles: {
        fillColor: azulOscuro,
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: 'center'
      },
      styles: {
        fontSize: 9,
        cellPadding: 8
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 30 },
        1: { cellWidth: 80 },
        3: { halign: 'center', cellWidth: 80 },
        4: { halign: 'center', cellWidth: 80 }
      }
    });

    // 5. Pie de página
    const finalY = (doc as any).lastAutoTable.finalY + 60;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Documento generado el: ${new Date().toLocaleDateString()}`,
      40,
      doc.internal.pageSize.height - 30
    );

    // 6. Descargar el archivo con nombre del grupo
    doc.save(`Reporte_Grupo_${this.grupo.codigo}.pdf`);
  }
}
