import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {NgxDragDirective} from './drag.directive';

/**
 * The directive that allows to mark HTML element as handle of dragging element for {@link NgxDragDirective}
 *
 * @author Dmytro Parfenov <dmitryparfenov937@gmail.com>
 *
 * @dynamic
 * @see https://angular.io/guide/angular-compiler-options#strictmetadataemit
 */
@Directive({ selector: '[ngxDragHandle]' })
export class NgxDragHandleDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly dragDirective = inject(NgxDragDirective, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);


  /**
   * @inheritDoc
   */
  ngAfterViewInit(): void {
    this.observe();
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {
    this.observe();
  }

  /**
   * Sets host element as observable point for {@link NgxDragDirective}
   */
  private observe(): void {
    if (isPlatformServer(this.platformId) || !this.dragDirective) {
      return;
    }

    this.dragDirective.observe(this.elementRef.nativeElement);
  }
}
