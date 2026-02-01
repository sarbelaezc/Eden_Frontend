import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { MenuService } from '../services/menu.service'
import { map, of, switchMap } from 'rxjs'

export const permissionGuard: CanActivateFn = (route, state) => {
    const menuService = inject(MenuService)
    const router = inject(Router)

    // Helper to check permission
    const checkPermission = () => {
        // If the menu is still empty (maybe failed or no items), we might need to handle it.
        // Ideally we should have items if the user has any permissions.
        if (menuService.isPathAllowed(state.url)) {
            return true
        }
        // Debug info
        // console.warn('Access denied to', state.url, 'Allowed:', menuService.menuItems().map(i => i.path));
        return router.createUrlTree(['/403'])
    }

    // If items are already loaded, check immediately
    if (menuService.menuItems().length > 0) {
        return checkPermission()
    }

    // If not loaded, load them first
    return menuService.loadMenu().pipe(
        map(() => checkPermission())
    )
}
