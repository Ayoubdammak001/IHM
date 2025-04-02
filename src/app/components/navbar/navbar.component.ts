import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/enums';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: any;
  isNavbarCollapsed = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(
      user => this.currentUser = user
    );
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === Role.ADMIN;
  }

  get isProvider(): boolean {
    return this.currentUser?.role === Role.PROVIDER;
  }

  get isClient(): boolean {
    return this.currentUser?.role === Role.CLIENT;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 