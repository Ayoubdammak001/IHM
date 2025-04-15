import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/enums';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  currentUser: any;
  isNavbarCollapsed = true;

  constructor(
    private authService: AuthService
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
  }
} 