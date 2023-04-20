import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesDispatcherComponent } from './courses-dispatcher.component';

describe('CoursesDispatcherComponent', () => {
  let component: CoursesDispatcherComponent;
  let fixture: ComponentFixture<CoursesDispatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursesDispatcherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesDispatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
