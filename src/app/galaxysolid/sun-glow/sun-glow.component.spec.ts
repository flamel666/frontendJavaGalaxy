import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunGlowComponent } from './sun-glow.component';

describe('SunGlowComponent', () => {
  let component: SunGlowComponent;
  let fixture: ComponentFixture<SunGlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunGlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunGlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
