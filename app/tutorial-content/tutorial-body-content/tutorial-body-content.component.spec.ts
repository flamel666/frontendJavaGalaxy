import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialBodyContentComponent } from './tutorial-body-content.component';

describe('TutorialBodyContentComponent', () => {
  let component: TutorialBodyContentComponent;
  let fixture: ComponentFixture<TutorialBodyContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialBodyContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialBodyContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
