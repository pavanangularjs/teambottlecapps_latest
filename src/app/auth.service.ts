import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Set User Secure Token
  setSessionToken(secure_token: string) {
    localStorage.setItem('SessionId', secure_token);
  }

  // Set User Secure Token
  getSessionToken() {
    return localStorage.getItem('SessionId');
  }

  // Set User Secure Token
  setUserId(userId: number) {
    localStorage.setItem('UserId', userId.toString());
  }

  // Set User Secure Token
  getUserId() {
    return localStorage.getItem('UserId');
  }

  // Check User is LoggedIn or not!
  isLoggednIn() {
    return (this.getUserId() !== '0');
  }

  // Logout method
  logout() {
    localStorage.removeItem('SessionId');
    localStorage.removeItem('UserId');
    this.router.navigate(['login']);
  }
}
