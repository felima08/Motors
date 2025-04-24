import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EstoqueMap } from '../models/car/estoque-map.model';

@Injectable({
    providedIn: 'root'
})
export class EstoqueService {
    private estoqueSubject = new BehaviorSubject<EstoqueMap>({
        '1': 3, // Alterei para testar
        '2': 1, // Alterei para testar
        '3': 3,
        '4': 6,
        '5': 0,
        '6': 8,
        '7': 5,
        '8': 12,
        '9': 8,
        '10': 2,
        '11': 15,
        '12': 9,
    });
    estoque$: Observable<EstoqueMap> = this.estoqueSubject.asObservable();
    private estoqueSnapshot: EstoqueMap = {...this.estoqueSubject.value};

    constructor() {
        this.estoque$.subscribe(estoque => {
            this.estoqueSnapshot = {...estoque};
            console.log('[EstoqueService] (Snapshot Atualizado):', this.estoqueSnapshot);
        });
    }

    getEstoque(): EstoqueMap {
        return this.estoqueSnapshot;
    }

    getQuantidade(carroId: string): number | undefined {
        return this.estoqueSnapshot[carroId];
    }

    baixarEstoque(carroId: string, quantidade: number = 1): boolean {
        const estoqueAtual = this.estoqueSubject.value;
        if (estoqueAtual[carroId] && estoqueAtual[carroId] >= quantidade) {
            estoqueAtual[carroId] -= quantidade;
            this.estoqueSubject.next({...estoqueAtual});
            console.log(`[EstoqueService] Estoque do carro ${carroId} atualizado para: ${estoqueAtual[carroId]}`);
            console.log('[EstoqueService] Novo estado do estoque (Subject):', this.estoqueSubject.value);
            return true;
        } else {
            console.log(`[EstoqueService] Estoque insuficiente para o carro ${carroId}. Disponível: ${estoqueAtual[carroId] || 0}`);
            return false;
        }
    }

    isVendido(carroId: string): boolean {
        return this.estoqueSnapshot[carroId] === 0;
    }

    atualizarEstoque(novoEstoque: EstoqueMap): void {
        this.estoqueSubject.next(novoEstoque);
        console.log('[EstoqueService] Estoque atualizado (via atualizarEstoque):', novoEstoque);
    }
}