import {Inject, Injectable} from '@angular/core';
import {EMPTY, fromEvent, merge, Observable} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MovementNative} from './movement/movement-native';
import {PositionBase} from './position-base';
import {MovementBase} from './movement/movement-base';
import {WINDOW} from './window.token';

/**
 * The service that allows to observe the element dragging
 *
 * @author Dmytro Parfenov <dmitryparfenov937@gmail.com>
 *
 * @internal
 *
 * @dynamic
 * @see https://angular.io/guide/angular-compiler-options#strictmetadataemit
 */
@Injectable({
  providedIn: 'root',
})
export class DragService {
  /**
   * Emits on mouse or touch event was ended
   */
  private readonly leave$ = merge(
    fromEvent<MovementNative>(this.document, 'mouseup'),
    fromEvent<MovementNative>(this.document, 'touchend')
  );

  /**
   * Emits on mouse or touch move
   */
  private readonly move$ = merge(
    fromEvent<MovementNative>(this.document, 'mousemove'),
    fromEvent<MovementNative>(this.document, 'touchmove')
  );

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  /**
   * Creates an observable that emits drag event
   */
  fromElement(target: HTMLElement): Observable<MovementBase> {
    if (!this.document) {
      return EMPTY;
    }

    const enter$ = merge(
      fromEvent<MovementNative>(target, 'mousedown'),
      fromEvent<MovementNative>(target, 'touchstart')
    );

    return enter$.pipe(
      tap((event) => event.preventDefault()),
      map((event) => this.fromEnter(event)),
      switchMap((event) => this.forMove(event))
    );
  }

  /**
   * Returns position of mouse or touch event
   */
  private fromMovementNativeEvent(event: MovementNative): PositionBase {
    let x = 0;
    let y = 0;

    if (!this.window) {
      return { x, y };
    }

    if ('TouchEvent' in this.window && event instanceof TouchEvent) {
      const touch = event.touches.length ? event.touches.item(0) : null;
      x = touch ? touch.clientX : 0;
      y = touch ? touch.clientY : 0;
    }

    if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
    }

    return { x, y };
  }

  /**
   * Returns position of event when drag was started
   */
  private fromEnter(event: MovementNative): PositionBase {
    return this.fromMovementNativeEvent(event);
  }

  /**
   * Implements behaviour to detect drag events
   */
  private forMove(initial: PositionBase): Observable<MovementBase> {
    return this.move$.pipe(
      map((event) => {
        const positionBase = this.fromMovementNativeEvent(event);

        return {
          ...positionBase,
          initial,
          nativeEvent: event,
        };
      }),
      takeUntil(this.leave$)
    );
  }
}
