import {Component, DebugElement} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxDragHandleDirective} from './drag-handle.directive';

@Component({
  imports: [
    NgxDragHandleDirective
  ],
  template: `
    <div ngxDragHandle></div>
  `
})
class TestComponent {
}

describe('NgxDragHandleDirective', () => {
  let debugElement: DebugElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      imports: [NgxDragHandleDirective, TestComponent]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxDragHandleDirective));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(debugElement).toBeTruthy();
  });
});
