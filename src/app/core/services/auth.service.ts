import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
    access: string;
    refresh: string;
    user: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        is_staff: boolean;
    };
}

interface RefreshResponse {
    access: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    private readonly accessToken = signal<string | null>(null);
    
    isAuthenticated = signal(false);
    currentUser = signal<User | null>(null);
    
    constructor() {
        this.restoreSession();
    }

    login(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, {
            username,
            password
        }).pipe(
            tap(response => {
                this.accessToken.set(response.access);
                sessionStorage.setItem('refresh_token', response.refresh);
                this.isAuthenticated.set(true);
                const user = { ...response.user, is_active: true };
                this.currentUser.set(user);
                this.saveUserToStorage(user);
            })
        );
    }

    refreshToken(): Observable<RefreshResponse> {
        const refreshToken = this.getRefreshToken();
        return this.http.post<RefreshResponse>(`${this.apiUrl}/token/refresh/`, {
            refresh: refreshToken
        }).pipe(
            tap(response => {
                this.accessToken.set(response.access);
                this.isAuthenticated.set(true);
            })
        );
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/me/`).pipe(
            tap(user => {
                this.currentUser.set(user);
                this.saveUserToStorage(user);
            })
        );
    }

    logout(): void {
        this.accessToken.set(null);
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('current_user');
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
    }

    private saveUserToStorage(user: User): void {
        sessionStorage.setItem('current_user', JSON.stringify(user));
    }

    private loadUserFromStorage(): User | null {
        const userJson = sessionStorage.getItem('current_user');
        if (!userJson) return null;
        try { return JSON.parse(userJson); }
        catch { return null; }
    }

    getRefreshToken(): string | null {
        return sessionStorage.getItem('refresh_token');
    }

    getAuthToken(): string | null {
        return this.accessToken();
    }

    private restoreSession(): void {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            this.refreshToken().pipe(
                switchMap(() => this.getCurrentUser())
            ).subscribe({
                next: () => this.isAuthenticated.set(true),
                error: (err) => {
                    console.error('Error al restaurar sesi�n:', err);
                    const storedUser = this.loadUserFromStorage();
                    if (storedUser) {
                        this.currentUser.set(storedUser);
                        this.isAuthenticated.set(true);
                    } else {
                        this.logout();
                    }
                }
            });
        }
    }

    getUserDisplayName(): string {
        const user = this.currentUser();
        if (!user) return '';
        if (user.first_name || user.last_name) {
            return `${user.first_name} ${user.last_name}`.trim();
        }
        return user.username;
    }
}
