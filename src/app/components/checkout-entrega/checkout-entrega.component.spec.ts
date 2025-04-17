import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutEntregaComponent } from './checkout-entrega.component';

describe('CheckoutEntregaComponent', () => {
  let component: CheckoutEntregaComponent;
  let fixture: ComponentFixture<CheckoutEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutEntregaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
