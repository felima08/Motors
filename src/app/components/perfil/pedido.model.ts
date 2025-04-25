export interface PedidoDetalhe {
    idPedido: string;
    dataPedido: Date;
    dataEntregaEstimada: Date;
    valorTotal: number;
    statusEntrega: string;
    itens: ItemPedido[];
  }
  
  export interface ItemPedido {
    nomeCarro: string;
    precoUnitario: number;
    quantidade: number;
    imageUrl: string;
  }