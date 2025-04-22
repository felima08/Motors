import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private estoque : {[key: string]: number} = {
   '1': 5,
    '2': 10,
  };

  constructor() { }

  getEstoque(): { [key: string]: number } {
    return this.estoque;
  }

  getQuantidade(carroId: string): number | undefined {
    return this.estoque[carroId];
  }

  baixarEstoque(carroId: string, quantidade: number = 1): boolean {
    if (this.estoque[carroId] && this.estoque[carroId] >= quantidade) {
      this.estoque[carroId] -= quantidade;
      console.log(`Estoque do carro ${carroId} atualizado para: ${this.estoque[carroId]}`);
      return true;
    } else {
      console.log(`Estoque insuficiente para o carro ${carroId}. Disponível: ${this.estoque[carroId] || 0}`);
      return false;
    }
  }
}