import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityMenuComponent } from './utility-menu.component';

describe('UtilityMenuComponent', () => {
  let component: UtilityMenuComponent;
  let fixture: ComponentFixture<UtilityMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilityMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
