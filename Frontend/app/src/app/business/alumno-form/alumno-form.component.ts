import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlumnoDTO, AlumnoResponse } from '../../models/alumno.model';
import { AlumnoService } from '../../services/alumno/alumno.service';

@Component({
  selector: 'app-alumno-form',
  standalone: false,
  templateUrl: './alumno-form.component.html',
  styleUrl: './alumno-form.component.scss'
})
export class AlumnoFormComponent {

}
