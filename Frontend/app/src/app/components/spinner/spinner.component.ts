import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-spinner',
  standalone: false,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent implements OnInit {


  isLoading$!: Observable<boolean>;

  constructor(private spinnerSvc: SpinnerService) {}

  ngOnInit(): void {
    this.isLoading$ = this.spinnerSvc.isLoading$;
  }
}
