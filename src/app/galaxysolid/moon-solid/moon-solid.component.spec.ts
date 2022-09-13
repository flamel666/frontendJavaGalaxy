import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonSolidComponent } from './moon-solid.component';

describe('MoonSolidComponent', () => {
  let component: MoonSolidComponent;
  let fixture: ComponentFixture<MoonSolidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoonSolidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoonSolidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
