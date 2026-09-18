import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'clinicflow-front';

 protected menuItems = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Pacientes', icon: 'groups', route: '/pacientes' },
  { label: 'Médicos', icon: 'medical_services', route: '/medicos' },
  { label: 'Consultas', icon: 'event_note', route: '/consultas' }
];}