import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidoDetalhe, ItemPedido } from '../../pedido.model'; // Ajuste o caminho da importação
import { PedidoService } from '../../pedido.service'; // Ajuste o caminho da importação
import { HeaderComponent } from '../../header/header.component'; // Ajuste o caminho conforme sua estrutura

@Component({
  selector: 'app-detalhe-pedido',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './detalhe-pedido.component.html',
  styleUrls: ['./detalhe-pedido.component.css']
})
export class DetalhePedidoComponent implements OnInit {
  pedidoId: string | null = null;
  detalhePedido: PedidoDetalhe | undefined;
  pedidoService = inject(PedidoService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pedidoId = params.get('id');
      if (this.pedidoId) {
        this.carregarDetalhesPedido(this.pedidoId);
      }
    });
  }

  carregarDetalhesPedido(pedidoId: string): void {
    // Simulação de busca de detalhes do pedido
    this.pedidoService.getDetalhePedido(pedidoId).subscribe(
      (detalhe) => {
        this.detalhePedido = detalhe;
      },
      (error) => {
        console.error('Erro ao carregar detalhes do pedido:', error);
        // Lógica para exibir mensagem de erro ao usuário
      }
    );
  }
}