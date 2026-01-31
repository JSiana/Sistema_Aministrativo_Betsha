import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Route, Router } from '@angular/router';
import { SpinnerService } from './services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'app';

  
  constructor(
    private router: Router,
    private spinnerSvc: SpinnerService
  ) {}
  ngOnInit(): void {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.spinnerSvc.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.spinnerSvc.hide();
      }
    });
  }


}
