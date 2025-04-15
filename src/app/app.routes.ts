import { Routes } from '@angular/router';
import { MeuFormularioComponent } from './meu-formulario/meu-formulario.component';
import { HomeComponent } from './components/home/home.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component'; // Importe o CarrinhoComponent
import { PerfilComponent } from './components/perfil/perfil.component'; // Importe o PerfilComponent

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
    path: 'perfil',
    component: PerfilComponent // Adicione esta rota para o PerfilComponent
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