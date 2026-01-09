import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar" role="navigation" aria-label="Navegación principal">
      <div class="navbar-brand">
        <a href="#main-content" class="navbar-brand-link" aria-label="Ir al contenido principal">
          <h1>Eden</h1>
        </a>
      </div>
      <ul class="nav-links">
        <li>
          <a 
            routerLink="/dashboard" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            aria-current="page">
            Dashboard
          </a>
        </li>
        <li>
          <a 
            routerLink="/dashboard/products" 
            routerLinkActive="active"
            aria-current="page">
            Productos
          </a>
        </li>
        <li>
          <a 
            routerLink="/dashboard/machinery" 
            routerLinkActive="active"
            aria-current="page">
            Maquinaria
          </a>
        </li>
        <li>
          <a 
            routerLink="/dashboard/personnel" 
            routerLinkActive="active"
            aria-current="page">
            Personal
          </a>
        </li>
        <li>
          <a 
            routerLink="/settings" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            aria-current="page">
            Settings
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #2c3e50;
      border-bottom: 2px solid #1a252f;
      z-index: 1000;
      position: relative;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
    }

    .navbar-brand-link {
      text-decoration: none;
      color: inherit;
      display: flex;
      align-items: center;

      &:focus {
        outline: 2px solid #3498db;
        outline-offset: 4px;
        border-radius: 4px;
      }

      h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #ffffff;
      }
    }

    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    .nav-links a {
      text-decoration: none;
      color: #ecf0f1;
      font-weight: 500;
      transition: color 0.3s, border-bottom-color 0.3s;
      padding-bottom: 0.25rem;
      border-bottom: 2px solid transparent;
    }

    .nav-links a:hover {
      color: #3498db;
    }

    .nav-links a:focus {
      outline: 2px solid #3498db;
      outline-offset: 2px;
      border-radius: 2px;
    }

    .nav-links a.active {
      color: #3498db;
      border-bottom-color: #3498db;
    }
  `]
})
export class NavbarComponent {}
