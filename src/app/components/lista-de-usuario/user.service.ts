import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable()


export class UserService {

  constructor(private http: HttpClient) { }

   list(): Observable<User[]> {
      return this.http.get<User[]>('http://localhost:3000/users');
    }
}
