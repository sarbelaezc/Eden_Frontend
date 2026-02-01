import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core'
import { RouterLink, RouterLinkActive, Router } from '@angular/router'
import { AuthService } from '../../core/services/auth.service'
import { MenuService } from '../../core/services/menu.service'
import { ThemeService } from '../../core/services/theme.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  readonly menuService = inject(MenuService);

  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);

  userDisplayName = computed(() => this.authService.getUserDisplayName());
  userInitials = computed(() => {
    const name = this.authService.getUserDisplayName()
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  });

  isMenuOpen = signal(false);

  constructor() {
    // Cargar menú al iniciar (si ya está autenticado)
    if (this.authService.isAuthenticated()) {
      this.menuService.loadMenu().subscribe()
    }

    effect(() => {
      // Re-cargar menú si cambia estado auth (ej. login/logout)
      if (this.authService.isAuthenticated()) {
        this.menuService.loadMenu().subscribe()
      } else {
        this.menuService.menuItems.set([])
      }
    })

    // Prevenir scroll cuando el menú móvil está abierto
    effect(() => {
      if (this.isMenuOpen()) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    })
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value)
  }

  closeMenu(): void {
    this.isMenuOpen.set(false)
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  onLogout(): void {
    this.closeMenu()
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
