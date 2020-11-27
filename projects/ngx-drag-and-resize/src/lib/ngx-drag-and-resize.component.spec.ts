import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDragAndResizeComponent } from './ngx-drag-and-resize.component';

describe('NgxDragAndResizeComponent', () => {
  let component: NgxDragAndResizeComponent;
  let fixture: ComponentFixture<NgxDragAndResizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxDragAndResizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDragAndResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
