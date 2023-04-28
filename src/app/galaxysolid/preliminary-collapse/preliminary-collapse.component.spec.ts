import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminaryCollapseComponent } from './preliminary-collapse.component';

describe('PreliminaryCollapseComponent', () => {
  let component: PreliminaryCollapseComponent;
  let fixture: ComponentFixture<PreliminaryCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreliminaryCollapseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreliminaryCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
