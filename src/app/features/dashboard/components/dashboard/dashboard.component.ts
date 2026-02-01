import { Component, ChangeDetectionStrategy, inject } from '@angular/core'
import { AuthService } from '../../../../core/services/auth.service'

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  protected authService = inject(AuthService);

  errorMessage = () => null;
  messageType = () => 'info';
}
