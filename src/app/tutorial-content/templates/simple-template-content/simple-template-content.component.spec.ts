import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTemplateContentComponent } from './simple-template-content.component';

describe('SimpleTemplateContentComponent', () => {
  let component: SimpleTemplateContentComponent;
  let fixture: ComponentFixture<SimpleTemplateContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTemplateContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTemplateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
