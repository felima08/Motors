import { Injectable } from '@angular/core';
import { CarComponent } from '../models/car/car.component';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private favoritosSubject = new BehaviorSubject<CarComponent[]>(this.getFavoritosDoLocalStorage());
  public favoritos$: Observable<CarComponent[]> = this.favoritosSubject.asObservable();

  constructor() { }

  private getFavoritosDoLocalStorage(): CarComponent[] {
    const favoritosString = localStorage.getItem('carrosFavoritos');
    return favoritosString ? JSON.parse(favoritosString) : [];
  }

  private setFavoritosNoLocalStorage(favoritos: CarComponent[]): void {
    localStorage.setItem('carrosFavoritos', JSON.stringify(favoritos));
    this.favoritosSubject.next(favoritos);
  }

  adicionarFavorito(carro: CarComponent): void {
    const favoritosAtuais = this.favoritosSubject.value;
    if (!favoritosAtuais.some(fav => fav.name === carro.name)) { // Verifica se já não está favoritado
      const novosFavoritos = [...favoritosAtuais, carro];
      this.setFavoritosNoLocalStorage(novosFavoritos);
    }
  }

  removerFavorito(carro: CarComponent): void {
    const favoritosAtuais = this.favoritosSubject.value;
    const novosFavoritos = favoritosAtuais.filter(fav => fav.name !== carro.name);
    this.setFavoritosNoLocalStorage(novosFavoritos);
  }

  isFavoritado(carro: CarComponent): boolean {
    return this.favoritosSubject.value.some(fav => fav.name === carro.name);
  }

  getFavoritos(): Observable<CarComponent[]> {
    return this.favoritos$;
  }
}