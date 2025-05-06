import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root', 
})
export class UserService {
  
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) { }

  list(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  create(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }
 update(user: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user);
  }

  delete(id:any): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
 
}