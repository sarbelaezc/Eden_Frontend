import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core'
import { PersonnelService } from '../../../../core/services/personnel.service'
import { AuthService } from '../../../../core/services/auth.service'

@Component({
  selector: 'app-personnel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss'
})
export class PersonnelComponent implements OnInit {
  private readonly personnelService = inject(PersonnelService);
  private readonly authService = inject(AuthService);

  personnelSummary = this.personnelService.personnelSummary;
  errorMessage = this.personnelService.errorMessage;
  messageType = this.personnelService.messageType;

  ngOnInit(): void {
    // Solo cargar si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      this.personnelService.loadPersonnelSummary()
    }
  }
}
