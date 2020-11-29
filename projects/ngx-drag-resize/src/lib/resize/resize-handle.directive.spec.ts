import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxResizeHandleDirective} from './resize-handle.directive';
import {NgxResizeHandleType} from './resize-handle-type.enum';

@Component({
  template: `
    <div [ngxResizeHandle]="resizeHandleType"></div>
  `
})
class TestComponent {
  resizeHandleType = NgxResizeHandleType.Left;
}

describe('NgxResizeHandleDirective', () => {
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ NgxResizeHandleDirective, TestComponent ]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxResizeHandleDirective));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(debugElement).toBeTruthy();
  });

  it('should update attribute', () => {
    fixture.componentInstance.resizeHandleType = NgxResizeHandleType.Right;
    fixture.detectChanges();

    const result = debugElement.nativeElement.getAttribute('data-ngx-resize-handle-type');

    expect(result).toBe(NgxResizeHandleType.Right);
  });
});
