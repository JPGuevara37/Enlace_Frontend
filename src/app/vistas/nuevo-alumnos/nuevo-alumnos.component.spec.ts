import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoAlumnosComponent } from './nuevo-alumnos.component';

describe('NuevoAlumnosComponent', () => {
  let component: NuevoAlumnosComponent;
  let fixture: ComponentFixture<NuevoAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoAlumnosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
