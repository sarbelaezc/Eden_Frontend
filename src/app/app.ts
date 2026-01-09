import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showNavbar()) {
      <app-navbar></app-navbar>
    }
    <main id="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Eden');
  private readonly router = inject(Router);
  protected showNavbar = signal(true);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavbar.set(!event.urlAfterRedirects.includes('/login'));
      });
  }
}
