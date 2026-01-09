import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { environment } from '../../../environments/environment'

interface AuthResponse {
    access: string
    refresh: string
    user: {
        id: number
        username: string
        email: string
        first_name: string
        last_name: string
        is_staff: boolean
    }
}

interface RefreshResponse {
    access: string
}

interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    is_staff: boolean
    is_active: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    isAuthenticated = signal(this.hasToken());
    currentUser = signal<User | null>(null);
    token = signal<string | null>(this.getToken());

    login(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, {
            username,
            password
        }).pipe(
            tap(response => {
                this.saveTokens(response.access, response.refresh)
                this.isAuthenticated.set(true)
                // El backend ya devuelve los datos del usuario en la respuesta
                this.currentUser.set({
                    ...response.user,
                    is_active: true
                })
            })
        )
    }

    refreshToken(): Observable<RefreshResponse> {
        const refreshToken = this.getRefreshToken()

        return this.http.post<RefreshResponse>(`${this.apiUrl}/token/refresh/`, {
            refresh: refreshToken
        }).pipe(
            tap(response => {
                this.saveToken(response.access)
            })
        )
    }

    logout(): void {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        this.isAuthenticated.set(false)
        this.currentUser.set(null)
        this.token.set(null)
    }

    private saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        this.token.set(accessToken)
    }

    private saveToken(token: string): void {
        localStorage.setItem('access_token', token)
        this.token.set(token)
    }

    private getToken(): string | null {
        return localStorage.getItem('access_token')
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token')
    }

    private hasToken(): boolean {
        return !!localStorage.getItem('access_token')
    }

    getAuthToken(): string | null {
        return this.token()
    }

    getUserDisplayName(): string {
        const user = this.currentUser()
        if (!user) return ''

        if (user.first_name || user.last_name) {
            return `${user.first_name} ${user.last_name}`.trim()
        }

        return user.username
    }
}
