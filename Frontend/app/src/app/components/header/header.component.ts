import { Component } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  constructor(private authService: AuthService, private router:Router){}
  
  @Output() toggleSidebar = new EventEmitter<void>();

  emitToggle() {
    this.toggleSidebar.emit();
  }

  cerrarSesion(): void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }




}
