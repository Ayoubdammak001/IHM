import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  currentUser: User | null = null;
  loading = true;
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.error = 'Unable to load user profile';
    }
    this.loading = false;
  }
}