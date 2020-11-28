import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import {BoundaryDirective} from '../shared/boundary/boundary.directive';
import {Axis} from '../core/axis';
import {PositionType} from './position-type';
import {NgxResize} from './resize';
import {DragService} from '../core/drag.service';
import {WINDOW} from '../core/window.token';
import {MovementBase} from '../core/movement/movement-base';
import {Movement} from '../core/movement/movement';
import {PositionBase} from '../core/position-base';
import {Boundary} from '../shared/boundary/boundary';
import {Scale} from './scale';
import {NgxResizeHandleType} from './resize-handle-type.enum';

/**
 * The directive that allows to resize HTML element on page
 *
 * @author Dmytro Parfenov <dmitryparfenov937@gmail.com>
 *
 * @dynamic
 * @see https://angular.io/guide/angular-compiler-options#strictmetadataemit
 */
@Directive({
  selector: '[ngxResize]',
})
export class NgxResizeDirective extends BoundaryDirective implements AfterViewInit, OnDestroy {

  /**
   * Emits when directive was destroyed
   */
  private destroy$ = new Subject();

  /**
   * Emits next every time when behaviour for wheel event was changed
   */
  private wheelBehaviourChange$ = new Subject();

  /**
   * Emits next every time when behaviour for touches event was changed
   */
  private touchBehaviourChange$ = new Subject();

  /**
   * An array of observers which affect on resizable element
   */
  private observers: { subscription: Subscription; element: HTMLElement }[] = [];

  /**
   * A regular expression for keyboard code
   */
  private wheelInitiatorRegExp: RegExp | null = null;

  /**
   * Make a resize unavailable by wheel
   */
  private isWheelDisabled = false;

  /**
   * Make a resize unavailable by touches
   */
  private isTouchesDisabled = false;

  /**
   * Minimal width in px
   */
  @Input() ngxResizeMinWidth = 0;

  /**
   * Minimal height in px
   */
  @Input() ngxResizeMinHeight = 0;

  /**
   * Aspect ratio the element will use during resize
   *
   * @example
   * 16/9 - 9/16 * 100 = 56.25
   * 1/1 - 1/1 * 100 = 100
   */
  @Input() ngxResizeAspectRatio = 0;

  /**
   * Disables any resize events
   */
  @Input() ngxResizeDisabled = false;

  /**
   * Locks axis for the resize
   */
  @Input() ngxResizeLockAxis: Axis = null;

  /**
   * Constrain of the resizing area.
   * Can be as a HTMLElement or CSS selector.
   * You can put 'window' string to define window object as a constrain.
   */
  @Input() set ngxResizeBoundary(boundary: string | HTMLElement) {
    this.boundary = boundary;
  }

  /**
   * A regular expression that matches with keyboard key code.
   * When value is provided the element can be scaled by 'Key + wheel'.
   * If value not provided the element can be scaled just by 'wheel'.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
   */
  @Input() set ngxResizeWheelInitiatorRegExp(pattern: RegExp | string) {
    if (!pattern) {
      this.wheelInitiatorRegExp = null;
      this.subscribeForWheelEvent();
      return;
    }

    this.wheelInitiatorRegExp = new RegExp(pattern);
    this.subscribeForWheelEvent();
  }

  /**
   * Disables resize by wheel.
   * By default is 'false'.
   */
  @Input() set ngxResizeWheelDisabled(disabled: boolean) {
    this.isWheelDisabled = disabled;
    this.subscribeForWheelEvent();
  }

  /**
   * Enables inversion for wheel event
   */
  @Input() ngxResizeWheelInverse = false;

  /**
   * Disables resize by touches.
   * By default is 'false'.
   * Resize work by using two fingers.
   */
  @Input() set ngxResizeTouchesDisabled(disabled: boolean) {
    this.isTouchesDisabled = disabled;
    this.subscribeForTouchEvents();
  }

  /**
   * Position CSS style. Allows 'absolute' and 'fixed'. Default is 'absolute'.
   * Will be applied to host element.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/position
   */
  @HostBinding('style.position')
  @Input()
  ngxResizePosition: PositionType = 'absolute';

  /**
   * Emits changes when element was resized
   */
  @Output() ngxResized = new EventEmitter<NgxResize>();

  constructor(
    readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly dragService: DragService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    super(window, document);
  }

  /**
   * @inheritDoc
   */
  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.initialResize();
    this.subscribeForWheelEvent();
    this.subscribeForTouchEvents();
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wheelBehaviourChange$.complete();
    this.touchBehaviourChange$.complete();
  }

  /**
   * Unsubscribe from the element dragging and remove it from an array of observable objects
   */
  unsubscribe(target: HTMLElement): void {
    const indexOf = this.observers.findIndex((item) => item.element === target);

    if (indexOf < 0) {
      return;
    }

    this.observers[indexOf].subscription.unsubscribe();
    this.observers.splice(indexOf, 1);
  }

  /**
   * Observe the element dragging which will be as handle for resize
   */
  observe(target: HTMLElement): void {
    if (!this.resolveInitiatorType(target)) {
      return;
    }

    let hostElementRect = this.elementRef.nativeElement.getBoundingClientRect();
    let eventInitial: PositionBase | null = null;

    const subscription$ = this.dragService
      .createObserver(target)
      .pipe(
        tap((event) => event.nativeEvent.preventDefault()),
        tap((event) => event.nativeEvent.stopImmediatePropagation()),
        map<MovementBase, Movement>((event) => {
          if (
            !eventInitial ||
            eventInitial.x !== event.initial.x ||
            eventInitial.y !== event.initial.y
          ) {
            eventInitial = event.initial;
            hostElementRect = this.elementRef.nativeElement.getBoundingClientRect();
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
            nativeEvent: event.nativeEvent,
          };
        }),
        tap(this.onResize.bind(this)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.observers.push({ subscription: subscription$, element: target });
  }

  /**
   * Starts the subscription for touch events
   */
  private subscribeForTouchEvents(): void {
    this.touchBehaviourChange$.next();

    if (this.isTouchesDisabled || isPlatformServer(this.platformId)) {
      return;
    }

    let prevDistance = 0;

    const touchStart$ = fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchstart').pipe(
      filter((event) => event.targetTouches.length === 2)
    );

    const touchEnd$ = fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchend');

    const touchMove$ = fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchmove', {
      passive: false,
    }).pipe(
      tap((event) => event.preventDefault()),
      filter((event) => event.targetTouches.length === 2 && event.changedTouches.length === 2)
    );

    touchStart$
      .pipe(
        tap(
          (event) => {
            const aTouch = event.targetTouches.item(0);
            const bTouch = event.targetTouches.item(1);

            if (!aTouch || !bTouch) {
              return;
            }

            prevDistance = this.touchesDistance(aTouch, bTouch);
          }),
        switchMap(() =>
          touchMove$.pipe(
            tap((event) => {
              const aTouch = event.targetTouches.item(0);
              const bTouch = event.targetTouches.item(1);

              if (!aTouch || !bTouch) {
                return;
              }

              const distance = this.touchesDistance(aTouch, bTouch);

              this.onScale({ delta: distance - prevDistance }, event);

              prevDistance = distance;
            }),
            takeUntil(touchEnd$)
          )
        ),
        takeUntil(this.destroy$),
        takeUntil(this.touchBehaviourChange$)
      )
      .subscribe();
  }

  /**
   * Returns distance between two touches
   */
  private touchesDistance(a: Touch, b: Touch): number {
    return Math.sqrt(Math.pow(b.clientX - a.clientX, 2) + Math.pow(b.clientY - a.clientY, 2));
  }

  /**
   * Make a subscription for wheel events
   */
  private subscribeForWheelEvent(): void {
    this.wheelBehaviourChange$.next();

    if (this.isWheelDisabled || isPlatformServer(this.platformId)) {
      return;
    }

    const wheel$ = fromEvent<WheelEvent>(this.elementRef.nativeElement, 'wheel').pipe(
      tap((event) => event.preventDefault()),
      tap((event) => {
        const delta = this.ngxResizeWheelInverse ? event.deltaY : event.deltaY * -1;
        this.onScale({ delta }, event);
      }),
      takeUntil(this.wheelBehaviourChange$),
      takeUntil(this.destroy$)
    );

    if (!this.wheelInitiatorRegExp) {
      wheel$.subscribe();
      return;
    }

    const wheelInitiatorFilter = filter<KeyboardEvent>((event) =>
      this.wheelInitiatorRegExp ? this.wheelInitiatorRegExp.test(event.code) : true);

    const wheelInitiatorStart$ = fromEvent<KeyboardEvent>(this.window, 'keydown').pipe(
      wheelInitiatorFilter
    );

    const wheelInitiatorEnd$ = fromEvent<KeyboardEvent>(this.window, 'keyup').pipe(
      wheelInitiatorFilter
    );

    wheelInitiatorStart$
      .pipe(
        switchMap(() => wheel$.pipe(takeUntil(wheelInitiatorEnd$))),
        takeUntil(this.wheelBehaviourChange$),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  /**
   * Runs initial resize for the host element
   */
  private initialResize(): void {
    setTimeout(() => {
      this.onScale({ delta: 0 });
    });
  }

  /**
   * Starts the calculation of scale event and changes host size
   */
  private onScale(scale: Scale, nativeEvent?: Event): void {
    const hostElementRect = this.elementRef.nativeElement.getBoundingClientRect();

    const boundaryRect = this.getBoundary();

    let maxUpscale = scale.delta;

    if (boundaryRect) {
      maxUpscale = Math.floor(
        Math.min(
          hostElementRect.top - boundaryRect.top,
          boundaryRect.right - hostElementRect.right,
          boundaryRect.bottom - hostElementRect.bottom,
          hostElementRect.left - boundaryRect.left
        )
      );
    }

    const maxDownscale =
      Math.max(
        0,
        Math.min(
          hostElementRect.width - this.ngxResizeMinWidth,
          hostElementRect.height - this.ngxResizeMinHeight
        )
      ) * -1;

    const delta = Math.max(maxDownscale, Math.min(maxUpscale, scale.delta));

    let top = hostElementRect.top - delta / 2;
    let left = hostElementRect.left - delta / 2;

    if (boundaryRect) {
      top = Math.max(boundaryRect.top, top);
      left = Math.max(boundaryRect.left, left);
    }

    let height = hostElementRect.height + delta;
    let width = hostElementRect.width + delta;

    if (boundaryRect) {
      height = Math.min(boundaryRect.bottom - top, height);
      width = Math.min(boundaryRect.right - left, width);
    }

    if (this.ngxResizeLockAxis === 'x') {
      left = hostElementRect.left;
      width = hostElementRect.width;
    }

    if (this.ngxResizeLockAxis === 'y') {
      top = hostElementRect.top;
      height = hostElementRect.height;
    }

    const proportionalSize =
      this.ngxResizeLockAxis === 'y'
        ? this.fromWidthProportion(width)
        : this.fromHeightProportion(height);

    if (proportionalSize && this.ngxResizeLockAxis === 'y') {
      height = proportionalSize;
      top = hostElementRect.top - (height - hostElementRect.height) / 2;
    }

    if (proportionalSize && this.ngxResizeLockAxis !== 'y') {
      width = proportionalSize;
      left = hostElementRect.left - (width - hostElementRect.width) / 2;
    }

    if (
      boundaryRect &&
      (top <= boundaryRect.top ||
        top + height >= boundaryRect.bottom ||
        left <= boundaryRect.left ||
        left + width >= boundaryRect.right)
    ) {
      top = hostElementRect.top;
      height = hostElementRect.height;
      left = hostElementRect.left;
      width = hostElementRect.width;
    }

    this.updateHostStyle('left', `${this.basedOnBoundary(left, 'left')}px`);
    this.updateHostStyle('width', `${width}px`);
    this.updateHostStyle('top', `${this.basedOnBoundary(top, 'top')}px`);
    this.updateHostStyle('height', `${height}px`);
    this.emitResize(nativeEvent);
  }

  /**
   * Check whether is resize is available for current initiator type
   */
  private canResize(initiatorType: NgxResizeHandleType): boolean {
    switch (initiatorType) {
      case NgxResizeHandleType.TopLeft:
      case NgxResizeHandleType.TopRight:
      case NgxResizeHandleType.BottomLeft:
      case NgxResizeHandleType.BottomRight:
        return !this.ngxResizeLockAxis;
      case NgxResizeHandleType.Left:
      case NgxResizeHandleType.Right:
        return this.ngxResizeLockAxis !== 'x';
      case NgxResizeHandleType.Top:
      case NgxResizeHandleType.Bottom:
        return this.ngxResizeLockAxis !== 'y';
    }

    return !this.ngxResizeLockAxis;
  }

  /**
   * Starts the calculation of resize event and changes host size
   */
  private onResize(event: Movement): void {
    if (this.ngxResizeDisabled) {
      return;
    }

    const initiatorType = this.resolveInitiatorType(event.initiator);

    if (!initiatorType || !this.canResize(initiatorType)) {
      return;
    }

    const hostElementRect = this.elementRef.nativeElement.getBoundingClientRect();

    const boundaryRect = this.getBoundary();

    if (!boundaryRect) {
      return;
    }

    switch (initiatorType) {
      case NgxResizeHandleType.TopLeft:
        return this.topLeftMovement(event, hostElementRect, boundaryRect);
      case NgxResizeHandleType.Top:
        return this.topMovement(event, hostElementRect, boundaryRect);
      case NgxResizeHandleType.TopRight:
        return this.topRightMovement(event, hostElementRect, boundaryRect);
      case NgxResizeHandleType.Right:
        return this.rightMovement(event, hostElementRect, boundaryRect);
      case NgxResizeHandleType.BottomRight:
        return this.bottomRightMovement(event, hostElementRect, boundaryRect);
      case NgxResizeHandleType.Bottom:
        return this.bottomMovement(event, hostElementRect, boundaryRect);
      case NgxResizeHandleType.BottomLeft:
        return this.bottomLeftMovement(event, hostElementRect, boundaryRect);
      case NgxResizeHandleType.Left:
        return this.leftMovement(event, hostElementRect, boundaryRect);
    }
  }

  private topLeftMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    if (this.ngxResizeAspectRatio) {
      this.topMovement(event, hostElementRect, boundaryRect);
      return;
    }

    this.topMovement(event, hostElementRect, boundaryRect);
    this.leftMovement(event, hostElementRect, boundaryRect);
  }

  private topRightMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    if (this.ngxResizeAspectRatio) {
      this.topMovement(event, hostElementRect, boundaryRect);
      return;
    }

    this.topMovement(event, hostElementRect, boundaryRect);
    this.rightMovement(event, hostElementRect, boundaryRect);
  }

  private bottomRightMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    if (this.ngxResizeAspectRatio) {
      this.bottomMovement(event, hostElementRect, boundaryRect);
      return;
    }

    this.bottomMovement(event, hostElementRect, boundaryRect);
    this.rightMovement(event, hostElementRect, boundaryRect);
  }

  private bottomLeftMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    if (this.ngxResizeAspectRatio) {
      this.bottomMovement(event, hostElementRect, boundaryRect);
      return;
    }

    this.bottomMovement(event, hostElementRect, boundaryRect);
    this.leftMovement(event, hostElementRect, boundaryRect);
  }

  private topMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    let y = event.y - event.offsetFromHost.top;

    if (boundaryRect) {
      y = Math.max(boundaryRect.top, Math.min(y, boundaryRect.bottom));
    }

    let top = Math.min(y, hostElementRect.bottom - this.ngxResizeMinHeight);
    let height = hostElementRect.height - (top - hostElementRect.top);

    const initiatorType = this.resolveInitiatorType(event.initiator);

    const widthProportions = initiatorType ? this.getWidthProportions(boundaryRect, hostElementRect, initiatorType, height) : null;

    if (widthProportions) {
      top = top + (height - this.fromWidthProportion(widthProportions.width));
      height = Math.min(height, this.fromWidthProportion(widthProportions.width));
    }

    this.updateHostStyle('top', `${this.basedOnBoundary(top, 'top')}px`);
    this.updateHostStyle('height', `${height}px`);

    if (widthProportions) {
      this.updateHostStyle('left', `${this.basedOnBoundary(widthProportions.left, 'left')}px`);
      this.updateHostStyle('width', `${widthProportions.width}px`);
    }

    this.emitResize(event.nativeEvent);
  }

  private rightMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    let x = event.x + event.offsetFromHost.right;

    if (boundaryRect) {
      x = Math.max(boundaryRect.left, Math.min(x, boundaryRect.right));
    }

    let width = Math.max(this.ngxResizeMinWidth, x - hostElementRect.left);

    if (boundaryRect) {
      width = Math.min(width, boundaryRect.right - hostElementRect.left);
    }

    const initiatorType = this.resolveInitiatorType(event.initiator);

    const heightProportions = initiatorType ? this.getHeightProportions(boundaryRect, hostElementRect, initiatorType, width) : null;

    if (heightProportions) {
      width = Math.min(width, this.fromHeightProportion(heightProportions.height));
    }

    this.updateHostStyle('width', `${width}px`);

    if (heightProportions) {
      this.updateHostStyle('top', `${this.basedOnBoundary(heightProportions.top, 'top')}px`);
      this.updateHostStyle('height', `${heightProportions.height}px`);
    }

    this.emitResize(event.nativeEvent);
  }

  private bottomMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    let y = event.y + event.offsetFromHost.bottom;

    if (boundaryRect) {
      y = Math.max(boundaryRect.top, Math.min(y, boundaryRect.bottom));
    }

    let height = Math.max(this.ngxResizeMinHeight, y - hostElementRect.top);

    if (boundaryRect) {
      height = Math.min(height, boundaryRect.bottom - hostElementRect.top);
    }

    const initiatorType = this.resolveInitiatorType(event.initiator);

    const widthProportions = initiatorType ? this.getWidthProportions(boundaryRect, hostElementRect, initiatorType, height) : null;

    if (widthProportions) {
      height = Math.min(height, this.fromWidthProportion(widthProportions.width));
    }

    this.updateHostStyle('height', `${height}px`);

    if (widthProportions) {
      this.updateHostStyle('left', `${this.basedOnBoundary(widthProportions.left, 'left')}px`);
      this.updateHostStyle('width', `${widthProportions.width}px`);
    }

    this.emitResize(event.nativeEvent);
  }

  private leftMovement(event: Movement, hostElementRect: DOMRect, boundaryRect: Boundary): void {
    let x = event.x - event.offsetFromHost.left;

    if (boundaryRect) {
      x = Math.max(boundaryRect.left, Math.min(x, boundaryRect.right));
    }

    let left = Math.min(x, hostElementRect.right - this.ngxResizeMinWidth);
    let width = hostElementRect.width - (left - hostElementRect.left);

    const initiatorType = this.resolveInitiatorType(event.initiator);

    const heightProportions = initiatorType ? this.getHeightProportions(boundaryRect, hostElementRect, initiatorType, width) : null;

    if (heightProportions) {
      left = left + (width - this.fromHeightProportion(heightProportions.height));
      width = Math.min(width, this.fromHeightProportion(heightProportions.height));
    }

    this.updateHostStyle('left', `${this.basedOnBoundary(left, 'left')}px`);
    this.updateHostStyle('width', `${width}px`);

    if (heightProportions) {
      this.updateHostStyle('top', `${this.basedOnBoundary(heightProportions.top, 'top')}px`);
      this.updateHostStyle('height', `${heightProportions.height}px`);
    }

    this.emitResize(event.nativeEvent);
  }

  /**
   * Get position and size of width
   */
  private getWidthProportions(
    boundaryRect: Boundary,
    hostElementRect: DOMRect,
    type: NgxResizeHandleType,
    height: number
  ): {
    left: number;
    width: number;
  } | null {
    let width = this.fromHeightProportion(height);

    if (!width) {
      return null;
    }

    if (type !== NgxResizeHandleType.TopLeft && type !== NgxResizeHandleType.BottomLeft) {
      width = boundaryRect ? Math.min(width, boundaryRect.right - hostElementRect.left) : width;
    }

    if (type !== NgxResizeHandleType.TopRight && type !== NgxResizeHandleType.BottomRight) {
      width = boundaryRect ? Math.min(width, hostElementRect.right - boundaryRect.left) : width;
    }

    let left = hostElementRect.left;

    if (type === NgxResizeHandleType.TopLeft || type === NgxResizeHandleType.BottomLeft) {
      left = left - (width - hostElementRect.width);
    }

    if (type === NgxResizeHandleType.Top || type === NgxResizeHandleType.Bottom) {
      left = left - (width - hostElementRect.width) / 2;
    }

    return { left, width };
  }

  /**
   * Get position and size of height
   */
  private getHeightProportions(
    boundaryRect: Boundary,
    hostElementRect: DOMRect,
    type: NgxResizeHandleType,
    width: number
  ): {
    top: number;
    height: number;
  } | null {
    let height = this.fromWidthProportion(width);

    if (!height) {
      return null;
    }

    if (type !== NgxResizeHandleType.TopLeft && type !== NgxResizeHandleType.TopRight) {
      height = boundaryRect ? Math.min(height, boundaryRect.bottom - hostElementRect.top) : height;
    }

    if (type !== NgxResizeHandleType.BottomLeft && type !== NgxResizeHandleType.BottomRight) {
      height = boundaryRect ? Math.min(height, hostElementRect.bottom - boundaryRect.top) : height;
    }

    let top = hostElementRect.top;

    if (type === NgxResizeHandleType.TopLeft || type === NgxResizeHandleType.TopRight) {
      top = top - (height - hostElementRect.height);
    }

    if (type === NgxResizeHandleType.Left || type === NgxResizeHandleType.Right) {
      top = top - (height - hostElementRect.height) / 2;
    }

    return { top, height };
  }

  /**
   * Get width based on {@link ngxResizeAspectRatio} from height
   */
  private fromHeightProportion(height: number): number {
    return !this.ngxResizeAspectRatio ? 0 : Math.floor((height / this.ngxResizeAspectRatio) * 100);
  }

  /**
   * Get height based on {@link ngxResizeAspectRatio} from width
   */
  private fromWidthProportion(width: number): number {
    return !this.ngxResizeAspectRatio ? 0 : Math.floor((width * this.ngxResizeAspectRatio) / 100);
  }

  /**
   * Updates host element style
   */
  private updateHostStyle(style: string, value: any): void {
    this.renderer.setStyle(this.elementRef.nativeElement, style, value);
  }

  /**
   * Resolves the type of handle HTML element
   */
  private resolveInitiatorType(initiator: HTMLElement): NgxResizeHandleType | null {
    return initiator.getAttribute('data-ngx-resize-handle-type') as NgxResizeHandleType;
  }

  /**
   * Emits resize event to the {@link ngxResized}
   */
  private emitResize(nativeEvent?: Event): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();

    this.ngxResized.emit({
      nativeEvent,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    });
  }
}
