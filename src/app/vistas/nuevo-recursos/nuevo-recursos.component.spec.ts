import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoRecursosComponent } from './nuevo-recursos.component';

describe('NuevoRecursosComponent', () => {
  let component: NuevoRecursosComponent;
  let fixture: ComponentFixture<NuevoRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoRecursosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NuevoRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
