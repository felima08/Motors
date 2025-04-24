import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  anoAtual: number = new Date().getFullYear();
  private viewportScroller: ViewportScroller;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, viewportScroller: ViewportScroller ) {
   
    
    this.viewportScroller = viewportScroller;
    this.matIconRegistry.addSvgIcon(
      'facebook',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/facebook.svg') // Ajuste o caminho conforme a sua estrutura de arquivos
    );
    this.matIconRegistry.addSvgIcon(
      'instagram',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/instagram.svg') // Ajuste o caminho conforme a sua estrutura de arquivos
    );
    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/twitter.svg') // Ajuste o caminho conforme a sua estrutura de arquivos
    );
    // Adicione outros ícones SVG conforme necessário
  }
  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  ngOnInit(): void {
  }
}