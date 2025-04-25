import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importe 'of' para simulação
import { PedidoDetalhe, ItemPedido } from './pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  // Simulação de dados de pedidos (substitua por sua lógica real de backend)
  private pedidosDetalhes: PedidoDetalhe[] = [
    {
      idPedido: 'PEDIDO001',
      dataPedido: new Date('2025-04-20T10:00:00-03:00'),
      dataEntregaEstimada: new Date('2025-04-28T18:00:00-03:00'),
      valorTotal: 123500.50,
      statusEntrega: 'Em trânsito',
      itens: [
        { nomeCarro: 'Sedan Confortável Prata', precoUnitario: 48000.50, quantidade: 1, imageUrl: 'prata.jpg' },
        { nomeCarro: 'Hatch Compacto Vermelho', precoUnitario: 35200.00, quantidade: 2, imageUrl: 'Hatch Compacto Vermelho.jpg' }
      ]
    },
    {
      idPedido: 'PEDIDO002',
      dataPedido: new Date('2025-04-22T14:30:00-03:00'),
      dataEntregaEstimada: new Date('2025-04-30T12:00:00-03:00'),
      valorTotal: 75000.00,
      statusEntrega: 'Processando',
      itens: [
        { nomeCarro: 'Esportivo Azul Veloz', precoUnitario: 75000.00, quantidade: 1, imageUrl: '/carro azul esportivo.jpg' }
      ]
    }
    // ... mais pedidos
  ];

  getDetalhePedido(pedidoId: string): Observable<PedidoDetalhe | undefined> {
    // Simulação de busca por ID
    const pedido = this.pedidosDetalhes.find(p => p.idPedido === pedidoId);
    return of(pedido); // Use 'of' para retornar um Observable com o resultado
  }
}