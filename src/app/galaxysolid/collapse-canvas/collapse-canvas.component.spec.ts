import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapseCanvasComponent } from './collapse-canvas.component';

describe('CollapseCanvasComponent', () => {
  let component: CollapseCanvasComponent;
  let fixture: ComponentFixture<CollapseCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapseCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapseCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
