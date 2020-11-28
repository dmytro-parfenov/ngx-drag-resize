import {Directive} from '@angular/core';
import {Boundary} from './boundary';

/**
 * The directive is used to work with boundary area for HTML element
 *
 * @author Dmytro Parfenov <dmitryparfenov937@gmail.com>
 *
 * @internal
 *
 * @dynamic
 * @see https://angular.io/guide/angular-compiler-options#strictmetadataemit
 */
@Directive({
  selector: '[ngxBoundary]',
})
export class BoundaryDirective {
  /**
   * CSS selector or HTML element
   */
  protected boundary: string | HTMLElement | Window | null = null;

  constructor(private readonly windowObject?: Window, private readonly documentObject?: Document) {}

  /**
   * Get boundary position based on {@link boundary}
   */
  protected getBoundary(): Boundary | null {
    const rect = {} as Boundary;

    const boundaryElement = this.resolveBoundaryElement();

    if (boundaryElement instanceof Element) {
      const boundaryElementRect = boundaryElement.getBoundingClientRect();

      rect.left = boundaryElementRect.left;
      rect.top = boundaryElementRect.top;
      rect.bottom = boundaryElementRect.bottom;
      rect.right = boundaryElementRect.right;

      return rect;
    }

    if (boundaryElement instanceof Window && this.windowObject) {
      rect.top = 0;
      rect.left = 0;
      rect.right = this.windowObject.innerWidth;
      rect.bottom = this.windowObject.innerHeight;

      return rect;
    }

    return null;
  }

  /**
   * Resolves HTML element based on {@link boundary}
   */
  protected resolveBoundaryElement(): Element | Window | null {
    if (!this.boundary) {
      return null;
    }

    if (this.boundary === 'window' && this.windowObject) {
      return this.windowObject;
    }

    if (typeof this.boundary === 'string') {
      return this.documentObject ? this.documentObject.querySelector(this.boundary) : null;
    }

    return this.boundary;
  }

  /**
   * Returns positional value based on boundary position
   */
  protected basedOnBoundary(value: number, position: 'left' | 'top'): number {
    const boundary = this.getBoundary();

    if (!boundary) {
      return value;
    }

    switch (position) {
      case 'left':
        return value - boundary.left;
      case 'top':
        return value - boundary.top;
    }

    return value;
  }
}
