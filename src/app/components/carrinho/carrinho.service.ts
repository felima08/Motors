import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Car {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    destaque?: boolean;
    vendido?: boolean;
    estoque?: number;
}

@Injectable({
    providedIn: 'root',
})
export class CarrinhoService {
    private carrinho: Car[] = [];
    private carrinhoSubject = new BehaviorSubject<Car[]>(this.carrinho);
    carrinho$ = this.carrinhoSubject.asObservable();

    adicionarAoCarrinho(car: Car) {
        this.carrinho.push(car);
        this.carrinhoSubject.next([...this.carrinho]);
        console.log('[CarrinhoService] Carro adicionado:', car);
        console.log('[CarrinhoService] Carrinho atual:', this.carrinho);
    }

    removerDoCarrinho(car: Car) {
        const index = this.carrinho.findIndex(item => item.id === car.id); // Use 'id' para remover
        if (index > -1) {
            this.carrinho.splice(index, 1);
            this.carrinhoSubject.next([...this.carrinho]);
            console.log('[CarrinhoService] Carro removido:', car);
            console.log('[CarrinhoService] Carrinho atual:', this.carrinho);
        }
    }

    getCarrinho(): Car[] {
        return [...this.carrinho];
    }

    limparCarrinho() {
        this.carrinho = [];
        this.carrinhoSubject.next([...this.carrinho]);
        console.log('[CarrinhoService] Carrinho limpo.');
    }

    getTotal(): number {
        return this.carrinho.reduce((total, item) => total + item.price, 0);
    }
}