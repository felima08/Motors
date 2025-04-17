import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CarrinhoService } from './components/carrinho/carrinho.service'; // Importe o CarrinhoService

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    CarrinhoService // Adicione o CarrinhoService como provider para que possa ser injetado
  ]
};