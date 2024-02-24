import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoguotComponent } from './loguot.component';

describe('LoguotComponent', () => {
  let component: LoguotComponent;
  let fixture: ComponentFixture<LoguotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoguotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoguotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
