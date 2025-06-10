import {
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import {Subject} from 'rxjs';
import {map, takeUntil, tap} from 'rxjs/operators';
import {isPlatformServer} from '@angular/common';
import {BoundaryDirective} from '../shared/boundary/boundary.directive';
import {PositionStrategy} from './position-strategy';
import {Axis} from '../core/axis';
import {NgxDrag} from './drag';
import {DragService} from '../core/drag.service';
import {MovementBase} from '../core/movement/movement-base';
import {Movement} from '../core/movement/movement';
import {Boundary} from '../shared/boundary/boundary';
import {PositionBase} from '../core/position-base';
import {WINDOW} from '../core/window.token';

/**
 * The directive that allows to drag HTML element on page
 *
 * @author Dmytro Parfenov <dmitryparfenov937@gmail.com>
 *
 * @dynamic
 * @see https://angular.io/guide/angular-compiler-options#strictmetadataemit
 */
@Directive({selector: '[ngxDrag]'})
export class NgxDragDirective extends BoundaryDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly dragService = inject(DragService);
  private readonly window = inject<Window>(WINDOW);
  private readonly platformId = inject(PLATFORM_ID);


  /**
   * Initial size and position of host element
   */
  private hostElementRectInitial: {
    left: number;
    top: number;
  } | null = null;

  /**
   * Emits when directive was destroyed
   */
  private destroy$ = new Subject();

  /**
   * Emits when observable target was changed
   */
  private observableTargetChange$ = new Subject();

  /**
   * Define positioning strategy.
   *
   * 'free' - position will changing by 'transform: translate3d()' style
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
   *
   * 'relative' - position will changing by 'top' and 'left' style
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/position
   *
   * Default is 'free'.
   */
  @Input() ngxDragPositionStrategy: PositionStrategy = 'free';

  /**
   * Locks axis for the dragging
   */
  @Input() ngxDragLockAxis: Axis = null;

  /**
   * Disable any drag events
   */
  @Input() ngxDragDisabled = false;

  /**
   * Constrain for the dragging element.
   * Can be as a HTMLElement or CSS selector.
   * You can put 'window' string to define window object as a constrain.
   */
  @Input() set ngxDragBoundary(boundary: string | HTMLElement) {
    this.boundary = boundary;
  }

  /**
   * Emits changes when element was dragged
   */
  @Output() ngxDragged = new EventEmitter<NgxDrag>();

  /**
   * @inheritDoc
   */
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.observe();
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {
    this.destroy$.next(void 0);
    this.destroy$.complete();
    this.observableTargetChange$.complete();
  }

  /**
   * Observe the element dragging which will be as handle for dragging
   */
  observe(target = this.elementRef.nativeElement): void {
    this.observableTargetChange$.next(void 0);

    let hostElementRect = this.elementRef.nativeElement.getBoundingClientRect();
    let eventInitial: PositionBase | null = null;

    this.dragService
      .fromElement(target)
      .pipe(
        tap((event) => event.nativeEvent.preventDefault()),
        map<MovementBase, Movement>((event) => {
          if (
            !eventInitial ||
            eventInitial.x !== event.initial.x ||
            eventInitial.y !== event.initial.y
          ) {
            eventInitial = event.initial;
            hostElementRect = this.elementRef.nativeElement.getBoundingClientRect();

            if (!this.hostElementRectInitial) {
              this.updateInitialRect();
            }
          }

          const offsetFromHost = {
            top: event.initial.y - hostElementRect.top,
            left: event.initial.x - hostElementRect.left,
            bottom: hostElementRect.bottom - event.initial.y,
            right: hostElementRect.right - event.initial.x,
          } as Boundary;

          return {
            ...event,
            initiator: target,
            offsetFromHost,
            initial: event.initial,
          };
        }),
        tap(this.onDrag.bind(this)),
        takeUntil(this.destroy$),
        takeUntil(this.observableTargetChange$)
      )
      .subscribe();
  }

  /**
   * Update size and position of host element
   */
  private updateInitialRect(): void {
    if (!this.window) {
      return;
    }

    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.hostElementRectInitial = {
      left: this.window.scrollX + rect.left,
      top: this.window.scrollY + rect.top,
    };
  }

  /**
   * Starts the calculation of drag event and changes host position
   */
  private onDrag(event: Movement): void {
    if (this.ngxDragDisabled) {
      return;
    }

    const hostElementRect = this.elementRef.nativeElement.getBoundingClientRect();
    const boundaryRect = this.getBoundary();

    let left = event.x - event.offsetFromHost.left;
    let top = event.y - event.offsetFromHost.top;

    if (boundaryRect) {
      left = Math.max(boundaryRect.left, left);
      left = Math.min(
        boundaryRect.left + (boundaryRect.right - boundaryRect.left) - hostElementRect.width,
        left
      );

      top = Math.max(boundaryRect.top, top);
      top = Math.min(
        boundaryRect.top + (boundaryRect.bottom - boundaryRect.top) - hostElementRect.height,
        top
      );
    }

    if (this.ngxDragPositionStrategy === 'free' && this.hostElementRectInitial) {
      left = left - this.hostElementRectInitial.left + this.window.scrollX;
      top = top - this.hostElementRectInitial.top + this.window.scrollY;

      if (this.ngxDragLockAxis === 'y') {
        top = hostElementRect.top - this.hostElementRectInitial.top + this.window.scrollY;
      }

      if (this.ngxDragLockAxis === 'x') {
        left = hostElementRect.left - this.hostElementRectInitial.left + this.window.scrollX;
      }

      this.updateHostStyle('transform', `translate3d(${left}px, ${top}px, 0)`);
      this.emitDrag(event.nativeEvent);
      return;
    }

    if (this.ngxDragLockAxis === 'x') {
      this.updateHostStyle('top', `${this.basedOnBoundary(top, 'top')}px`);
      this.emitDrag(event.nativeEvent);
      return;
    }

    if (this.ngxDragLockAxis === 'y') {
      this.updateHostStyle('left', `${this.basedOnBoundary(left, 'left')}px`);
      this.emitDrag(event.nativeEvent);
      return;
    }

    this.updateHostStyle('left', `${this.basedOnBoundary(left, 'left')}px`);
    this.updateHostStyle('top', `${this.basedOnBoundary(top, 'top')}px`);
    this.emitDrag(event.nativeEvent);
  }

  /**
   * Updates the host style
   */
  private updateHostStyle(style: string, value: any): void {
    this.renderer.setStyle(this.elementRef.nativeElement, style, value);
  }

  /**
   * Emits drag event to the {@link ngxDragged}
   */
  private emitDrag(nativeEvent?: Event): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.ngxDragged.emit({
      nativeEvent,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    });
  }
}
