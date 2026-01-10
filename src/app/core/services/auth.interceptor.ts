import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap, throwError, BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAuthToken();

  // Solo añadir token a peticiones del backend y excluir endpoints de auth
  if (token && 
      req.url.startsWith(environment.apiUrl) && 
      !req.url.includes('/login/') && 
      !req.url.includes('/token/refresh/')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Intentar refresh si es 401 o 403 (token expirado o sin permisos por token inválido)
      if ((error.status === 401 || error.status === 403) && 
          !req.url.includes('/login/') && 
          !req.url.includes('/token/refresh/')) {
        return handleAuthError(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

function handleAuthError(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService, router: Router): Observable<HttpEvent<unknown>> {
  if (isRefreshing) {
    // Si ya estamos refrescando, esperamos el nuevo token
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        }));
      })
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  const refreshToken = authService.getRefreshToken();
  
  // Si no hay refresh token, ir directo al login
  if (!refreshToken) {
    isRefreshing = false;
    authService.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('No refresh token available'));
  }

  return authService.refreshToken().pipe(
    switchMap((response) => {
      isRefreshing = false;
      refreshTokenSubject.next(response.access);
      
      // Reintentar la petición original con el nuevo token
      return next(req.clone({
        setHeaders: {
          Authorization: `Bearer ${response.access}`
        }
      }));
    }),
    catchError((err) => {
      isRefreshing = false;
      // Si el refresh falla, limpiar todo y redirigir al login
      console.error('Error al refrescar el token. Redirigiendo al login...', err);
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => err);
    })
  );
}
