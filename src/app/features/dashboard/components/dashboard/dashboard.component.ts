import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { PersonnelService } from '../../../../core/services/personnel.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private personnelService = inject(PersonnelService);
  protected authService = inject(AuthService);
  
  personnelSummary = this.personnelService.personnelSummary;

  ngOnInit(): void {
    // Solo cargar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      this.personnelService.loadPersonnelSummary();
    }
  }
}
