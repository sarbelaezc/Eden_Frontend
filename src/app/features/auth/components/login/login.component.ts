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
  messageType = signal<'error' | 'warning' | 'info'>('error');

  private readonly statusConfig: Record<number, { type: 'error' | 'warning' | 'info'; fallback: string }> = {
    400: { type: 'warning', fallback: 'Datos inválidos. Verifica la información ingresada.' },
    401: { type: 'error', fallback: 'Credenciales incorrectas. Verifica tu usuario y contraseña.' },
    500: { type: 'error', fallback: 'Error del servidor. Intenta nuevamente más tarde.' },
    0: { type: 'error', fallback: 'No se pudo conectar al servidor. Verifica tu conexión a internet.' }
  };

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
        this.loginForm.enable();
        this.isLoading.set(false);
        
        // Primero intentar extraer el mensaje de la API
        const apiMessage = this.extractErrorMessage(error);
        
        // Obtener configuración basada en status code
        const config = this.statusConfig[error.status] ?? { 
          type: 'error', 
          fallback: 'Error al iniciar sesión. Intenta nuevamente.' 
        };
        
        this.messageType.set(config.type);
        this.errorMessage.set(apiMessage || config.fallback);
      }
    });
  }

  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (!error.error) {
      return error.message || null;
    }
    
    // Si el error es un string directo, retornarlo
    if (typeof error.error === 'string') {
      return error.error;
    }
    
    // Propiedades comunes de mensajes de error en orden de prioridad
    const errorProps = ['detail', 'message', 'error', 'non_field_errors'];
    
    for (const prop of errorProps) {
      if (error.error[prop]) {
        return Array.isArray(error.error[prop]) 
          ? error.error[prop].join(' ') 
          : error.error[prop];
      }
    }
    
    // Errores de campos específicos (username, password, etc.)
    const fieldErrors = ['username', 'password'].filter(field => error.error[field]);
    
    if (fieldErrors.length > 0) {
      return fieldErrors
        .map(field => Array.isArray(error.error[field]) 
          ? error.error[field].join(' ') 
          : error.error[field]
        )
        .join(' ');
    }
    
    return null;
  }

  get username() {
    return this.loginForm.get('username')
  }

  get password() {
    return this.loginForm.get('password')
  }
}
