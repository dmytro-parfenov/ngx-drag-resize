import {Component, DebugElement} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxDragHandleDirective} from './drag-handle.directive';

@Component({
    template: `
    <div ngxDragHandle></div>
  `,
    standalone: false
})
class TestComponent { }

describe('NgxDragHandleDirective', () => {
  let debugElement: DebugElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      declarations: [ NgxDragHandleDirective, TestComponent ]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxDragHandleDirective));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(debugElement).toBeTruthy();
  });
});
