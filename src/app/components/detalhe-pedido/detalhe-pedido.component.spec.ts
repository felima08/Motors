import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhePedidoComponent } from './detalhe-pedido.component';

describe('DetalhePedidoComponent', () => {
  let component: DetalhePedidoComponent;
  let fixture: ComponentFixture<DetalhePedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhePedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhePedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
