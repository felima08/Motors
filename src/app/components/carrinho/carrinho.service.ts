import { Injectable } from '@angular/core';

interface Car {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private carrinho: Car[] = [];

  adicionarAoCarrinho(car: Car) {
    this.carrinho.push(car);
  }

  removerDoCarrinho(car: Car) {
    const index = this.carrinho.findIndex(item => item.name === car.name);
    if (index > -1) {
      this.carrinho.splice(index, 1);
    }
  }

  getCarrinho(): Car[] {
    return [...this.carrinho];
  }

  limparCarrinho() {
    this.carrinho = [];
  }
}