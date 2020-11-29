import {Component, DebugElement} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxDragDirective} from './drag.directive';

@Component({
  template: `
    <div ngxDrag></div>
  `
})
class TestComponent { }

describe('NgxDragDirective', () => {
  let debugElement: DebugElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      declarations: [ NgxDragDirective, TestComponent ]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxDragDirective));

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(debugElement).toBeTruthy();
  });

  it('should not throw on observe', () => {
    expect(() => { debugElement.injector.get(NgxDragDirective).observe(); }).not.toThrow();

    const element = document.createElement('div');
    expect(() => { debugElement.injector.get(NgxDragDirective).observe(element); }).not.toThrow();
  });
});
