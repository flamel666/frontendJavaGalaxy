import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenCodeComponent } from './hidden-code.component';

describe('HiddenCodeComponent', () => {
  let component: HiddenCodeComponent;
  let fixture: ComponentFixture<HiddenCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiddenCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
