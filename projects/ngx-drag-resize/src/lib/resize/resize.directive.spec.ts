import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgxResizeDirective} from './resize.directive';
import {PositionType} from './position-type';

@Component({
    template: `
    <div ngxResize [ngxResizePosition]="position"></div>
  `,
    standalone: false
})
class TestComponent {
  position: PositionType = 'absolute';
}

describe('NgxResizeDirective', () => {
  let debugElement: DebugElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ NgxResizeDirective, TestComponent ]
    }).createComponent(TestComponent);

    debugElement = fixture.debugElement.query(By.directive(NgxResizeDirective));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(debugElement).toBeTruthy();
  });

  it('should update position', () => {
    fixture.componentInstance.position = 'fixed';
    fixture.detectChanges();

    const result = debugElement.nativeElement.style.position;

    expect(result).toBe('fixed');
  });

  it('should not throw on observe', () => {
    const element = document.createElement('div');

    expect(() => { debugElement.injector.get(NgxResizeDirective).observe(element); }).not.toThrow();
  });
});
