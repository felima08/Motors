import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { EstoqueService } from '../estoque/estoque.service'; // Importe o EstoqueService

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
    private estoqueService = inject(EstoqueService); // Injeta o EstoqueService

    get itens(): Car[] {
        return [...this.carrinho];
    }

    adicionarAoCarrinho(car: Car) {
        const estoqueAtual = this.estoqueService.getQuantidade(car.id);
        const quantidadeNoCarrinho = this.carrinho.filter(item => item.id === car.id).length;

        if (estoqueAtual && estoqueAtual > quantidadeNoCarrinho) {
            this.carrinho.push(car);
            this.carrinhoSubject.next([...this.carrinho]);
            console.log('[CarrinhoService] Carro adicionado:', car);
            console.log('[CarrinhoService] Carrinho atual:', this.carrinho);
            return true; // Indica que o item foi adicionado
        } else {
            console.log(`[CarrinhoService] Estoque esgotado ou limite atingido para "${car.name}". Estoque: ${estoqueAtual}, No Carrinho: ${quantidadeNoCarrinho}`);
            return false; // Indica que o item não foi adicionado
        }
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