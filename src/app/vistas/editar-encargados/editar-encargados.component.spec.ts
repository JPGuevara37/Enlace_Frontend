import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEncargadosComponent } from './editar-encargados.component';

describe('EditarEncargadosComponent', () => {
  let component: EditarEncargadosComponent;
  let fixture: ComponentFixture<EditarEncargadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEncargadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarEncargadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
