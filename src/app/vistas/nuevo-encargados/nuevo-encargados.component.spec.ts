import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoEncargadosComponent } from './nuevo-encargados.component';

describe('NuevoEncargadosComponent', () => {
  let component: NuevoEncargadosComponent;
  let fixture: ComponentFixture<NuevoEncargadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoEncargadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoEncargadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
