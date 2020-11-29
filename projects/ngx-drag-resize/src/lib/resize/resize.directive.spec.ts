import {Component, DebugElement} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxResizeDirective} from './resize.directive';

@Component({
  template: `
    <div ngxResize></div>
  `
})
class TestComponent { }

describe('NgxResizeDirective', () => {
  let debugElement: DebugElement;

  beforeEach(() => {
    const fixture = TestBed.configureTestingModule({
      declarations: [ NgxResizeDirective, TestComponent ]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxResizeDirective));

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(debugElement).toBeTruthy();
  });
});
