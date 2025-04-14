import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuFormularioComponent } from './meu-formulario.component';

describe('MeuFormularioComponent', () => {
  let component: MeuFormularioComponent;
  let fixture: ComponentFixture<MeuFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeuFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeuFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
