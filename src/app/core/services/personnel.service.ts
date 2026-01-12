import { Injectable, inject, signal } from '@angular/core'
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../../environments/environment'

export interface Employee {
  id: number
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
  id_type: string
  id_type_display: string
  id_number: string
  position: string
  phone: string
  address: string
  hire_date: string
  status: 'active' | 'inactive' | 'suspended'
  status_display: string
  salary: string
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface PersonnelSummary {
  total: number
  active: number
  inactive: number
  suspended: number
  averageSalary: number
  totalPayroll: number
}

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/edicar/employees/`;

  personnelSummary = signal<PersonnelSummary>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    averageSalary: 0,
    totalPayroll: 0
  });

  errorMessage = signal<string | null>(null);
  messageType = signal<'error' | 'warning' | 'info'>('error');

  private readonly statusConfig: Record<number, { type: 'error' | 'warning' | 'info'; fallback: string }> = {
    400: { type: 'warning', fallback: 'Datos inválidos. Verifica la información ingresada.' },
    401: { type: 'error', fallback: 'No autorizado. Inicia sesión nuevamente.' },
    403: { type: 'error', fallback: 'Sin permisos para realizar esta operación.' },
    404: { type: 'warning', fallback: 'Empleado no encontrado.' },
    500: { type: 'error', fallback: 'Error del servidor. Intenta nuevamente más tarde.' },
    0: { type: 'error', fallback: 'No se pudo conectar al servidor. Verifica tu conexión a internet.' }
  };

  getEmployees(params?: {
    search?: string
    position?: string
    status?: string
    ordering?: string
  }): Observable<PaginatedResponse<Employee>> {
    let httpParams = new HttpParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString())
        }
      })
    }

    return this.http.get<PaginatedResponse<Employee>>(this.baseUrl, { params: httpParams })
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}${id}/`)
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee)
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}${id}/`, employee)
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`)
  }

  loadPersonnelSummary(): void {
    this.getEmployees().pipe(
      tap(response => {
        const employees = response.results
        const salaries = employees
          .filter(e => e.status === 'active')
          .map(e => Number.parseFloat(e.salary))

        const totalPayroll = salaries.reduce((sum, salary) => sum + salary, 0)
        const averageSalary = salaries.length > 0 ? totalPayroll / salaries.length : 0

        const summary: PersonnelSummary = {
          total: response.count,
          active: employees.filter(e => e.status === 'active').length,
          inactive: employees.filter(e => e.status === 'inactive').length,
          suspended: employees.filter(e => e.status === 'suspended').length,
          averageSalary: Math.round(averageSalary),
          totalPayroll: Math.round(totalPayroll)
        }
        this.personnelSummary.set(summary)
      })
    ).subscribe({
      next: () => {
        this.errorMessage.set(null)
      },
      error: (error: HttpErrorResponse) => {
        this.personnelSummary.set({
          total: 0,
          active: 0,
          inactive: 0,
          suspended: 0,
          averageSalary: 0,
          totalPayroll: 0
        })

        const apiMessage = this.extractErrorMessage(error)
        const config = this.statusConfig[error.status] ?? {
          type: 'error',
          fallback: 'Error al cargar datos del personal.'
        }

        this.messageType.set(config.type)
        this.errorMessage.set(apiMessage || config.fallback)
      }
    })
  }

  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (!error.error) {
      return error.message || null
    }

    if (typeof error.error === 'string') {
      return error.error
    }

    const errorProps = ['detail', 'message', 'error', 'non_field_errors']

    for (const prop of errorProps) {
      if (error.error[prop]) {
        return Array.isArray(error.error[prop])
          ? error.error[prop].join(' ')
          : error.error[prop]
      }
    }

    return null
  }
}
