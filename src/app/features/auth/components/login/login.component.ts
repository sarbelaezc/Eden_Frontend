import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../../../../core/services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]]
  });

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return
    }

    this.isLoading.set(true)
    this.errorMessage.set(null)
    this.loginForm.disable()

    const { username, password } = this.loginForm.value

    if (!username || !password) {
      this.loginForm.enable()
      this.isLoading.set(false)
      return
    }

    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading.set(false)
        this.router.navigate(['/dashboard'])
      },
      error: (error: HttpErrorResponse) => {
        this.loginForm.enable()
        this.isLoading.set(false)
        this.errorMessage.set(
          error.error?.detail || 'Credenciales inválidas. Intenta nuevamente.'
        )
      }
    })
  }

  get username() {
    return this.loginForm.get('username')
  }

  get password() {
    return this.loginForm.get('password')
  }
}
