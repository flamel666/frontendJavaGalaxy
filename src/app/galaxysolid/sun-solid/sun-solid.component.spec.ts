import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunSolidComponent } from './sun-solid.component';

describe('SunSolidComponent', () => {
  let component: SunSolidComponent;
  let fixture: ComponentFixture<SunSolidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunSolidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunSolidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
