import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvasunComponent } from './provasun.component';

describe('ProvasunComponent', () => {
  let component: ProvasunComponent;
  let fixture: ComponentFixture<ProvasunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvasunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvasunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
