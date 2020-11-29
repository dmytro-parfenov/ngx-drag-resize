import {Component, DebugElement} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxResizeHandleDirective} from './resize-handle.directive';

@Component({
  template: `
    <div [ngxResizeHandle]="null"></div>
  `
})
class TestComponent { }

describe('NgxResizeHandleDirective', () => {
  let debugElement: DebugElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      declarations: [ NgxResizeHandleDirective, TestComponent ]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxResizeHandleDirective));

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(debugElement).toBeTruthy();
  });
});
