import {Component, DebugElement} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxDragDirective} from './drag.directive';

@Component({
  imports: [
    NgxDragDirective
  ],
  template: `
    <div ngxDrag></div>
  `
})
class TestComponent {
}

describe('NgxDragDirective', () => {
  let debugElement: DebugElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      imports: [NgxDragDirective, TestComponent]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxDragDirective));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(debugElement).toBeTruthy();
  });

  it('should not throw on observe', () => {
    expect(() => {
      debugElement.injector.get(NgxDragDirective).observe();
    }).not.toThrow();

    const element = document.createElement('div');
    expect(() => {
      debugElement.injector.get(NgxDragDirective).observe(element);
    }).not.toThrow();
  });
});
