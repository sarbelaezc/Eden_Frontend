import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { tap, catchError, of } from 'rxjs'

export interface MenuItem {
    id: number
    name: string
    path: string
    icon: string
    order: number
}

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/menu/`;

    // Signal caches the current menu
    readonly menuItems = signal<MenuItem[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly error = signal<string | null>(null);

    /**
     * Fetches menu from API and updates signal.
     * Called typically on Login success or App Init.
     */
    loadMenu() {
        this.isLoading.set(true)
        return this.http.get<MenuItem[]>(this.apiUrl).pipe(
            tap(items => {
                this.menuItems.set(items)
                this.isLoading.set(false)
            }),
            catchError(err => {
                console.error('Error loading menu', err)
                this.error.set('Could not load menu')
                this.isLoading.set(false)
                return of([] as MenuItem[])
            })
        )
    }

    /**
     * Synchronous check if a path is allowed.
     * Relies on the signal being already populated.
     */
    isPathAllowed(url: string): boolean {
        const items = this.menuItems()
        if (items.length === 0) return false

        return items.some(item => {
            // Special handling for root dashboard to prevent wildcard access to siblings
            if (item.path === '/dashboard') {
                return url === '/dashboard' || url === '/dashboard/'
            }
            return url.startsWith(item.path)
        })
    }
}
