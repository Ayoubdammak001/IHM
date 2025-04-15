import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'] as Role;
    
    if (this.authService.hasRole(requiredRole)) {
      return true;
    }

    // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle requis
    this.router.navigate(['/']);
    return false;
  }
} 