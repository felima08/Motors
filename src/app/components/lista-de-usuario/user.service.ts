import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root', // Ou o módulo onde você registrou o UserService
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // Sua URL base da API

  constructor(private http: HttpClient) { }

  list(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  create(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }
}