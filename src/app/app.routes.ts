import { Routes } from '@angular/router';
import { MeuFormularioComponent } from './meu-formulario/meu-formulario.component';
import { HomeComponent } from './components/home/home.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component'; // Importe o CarrinhoComponent

export const routes: Routes = [
  {
    path: '',
    component: MeuFormularioComponent // Tela de boas-vindas na raiz
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'cadastro',
    component: MeuFormularioComponent,
    data: { isRegister: true }
  },
  {
    path: 'login',
    component: MeuFormularioComponent,
    data: { isRegister: false }
  },
  {
    path: 'carrinho',
    component: CarrinhoComponent // Adicione a rota para o CarrinhoComponent
  },
  {
    path: '**',
    redirectTo: '' // Rotas desconhecidas vão para a tela de boas-vindas
  }
];