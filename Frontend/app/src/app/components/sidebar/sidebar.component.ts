import { Component, EventEmitter, Output, Input } from '@angular/core';
import { trigger, state,style,transition,animate } from '@angular/animations';


@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('submenuToggle', [
      state('hidden', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      transition('hidden <=> visible', animate('300ms ease'))
    ])
  ]
})
export class SidebarComponent {

  activeSubmenu: string | null = null;

  toggleSubmenu(menu: string): void {
    this.activeSubmenu = this.activeSubmenu === menu ? null : menu;
  }

  isActive(menu: string): boolean {
    return this.activeSubmenu === menu;
  }

  getState(menu: string): 'visible' | 'hidden' {
    return this.isActive(menu) ? 'visible' : 'hidden';
  }

}
 
