import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('submenuToggle', [
      // Usamos 'open' y 'closed' para que sea más intuitivo
      state('closed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
        paddingTop: '0',
        paddingBottom: '0'
      })),
      state('open', style({
        height: '*',
        opacity: 1
      })),
      transition('closed <=> open', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class SidebarComponent {
  // Guardamos qué menú está expandido
  activeSubmenu: string | null = null;

  toggleSubmenu(menu: string): void {
    // Si haces clic en el que ya está abierto, se cierra (null), si no, se abre el nuevo
    this.activeSubmenu = this.activeSubmenu === menu ? null : menu;
  }

  // Esta función es la que llama el HTML para la animación y la clase .menu-open
  getState(menu: string): string {
    return this.activeSubmenu === menu ? 'open' : 'closed';
  }
}