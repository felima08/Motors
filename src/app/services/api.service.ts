import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // URL direta do JSON Server

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?email=${email}&password=${password}`);
  }

  checkEmailExists(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?email=${email}`);
  }
}