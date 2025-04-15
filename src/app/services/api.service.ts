// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, body);
  }

  // Métodos específicos podem ser mantidos ou usar os genéricos conforme necessário
  registerUser(userData: any): Observable<any> {
    return this.post('users', userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.get(`users?email=${email}&password=${password}`);
  }

  checkEmailExists(email: string): Observable<any> {
    return this.get(`users?email=${email}`);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.patch(`users/${userId}`, userData);
  }

  // Simulação de upload de foto de perfil
  uploadProfileImage(userId: number, fileName: string): Observable<any> {
    const imageUrl = `/assets/images/${fileName}`; // Simula a URL da imagem
    return this.patch(`users/${userId}`, { fotoPerfilUrl: imageUrl });
  }

  // Método para salvar os detalhes da compra
  salvarCompra(detalhesCompra: any): Observable<any> {
    return this.post('compras', detalhesCompra);
  }
}