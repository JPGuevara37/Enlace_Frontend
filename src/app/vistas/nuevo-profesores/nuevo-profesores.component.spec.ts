import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoProfesoresComponent } from './nuevo-profesores.component';

describe('NuevoProfesoresComponent', () => {
  let component: NuevoProfesoresComponent;
  let fixture: ComponentFixture<NuevoProfesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoProfesoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
