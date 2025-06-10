import { AfterViewInit, Directive, ElementRef, HostBinding, Input, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {NgxResizeHandleType} from './resize-handle-type.enum';
import {NgxResizeDirective} from './resize.directive';

/**
 * The directive that allows to mark HTML element as one of handle of resizing element for {@link NgxResizeDirective}
 *
 * @author Dmytro Parfenov <dmitryparfenov937@gmail.com>
 *
 * @dynamic
 * @see https://angular.io/guide/angular-compiler-options#strictmetadataemit
 */
@Directive({ selector: '[ngxResizeHandle]' })
export class NgxResizeHandleDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly resizeDirective = inject(NgxResizeDirective, { optional: true });

  /**
   * Sets the attribute which define the side the HTML element will affect during drag
   */
  @Input('ngxResizeHandle')
  @HostBinding('attr.data-ngx-resize-handle-type')
  type: NgxResizeHandleType | null = null;

  /**
   * @inheritDoc
   */
  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId) || !this.resizeDirective) {
      return;
    }

    this.resizeDirective.observe(this.elementRef.nativeElement);
  }

  /**
   * @inheritDoc
   */
  ngOnDestroy(): void {
    if (!this.resizeDirective) {
      return;
    }

    this.resizeDirective.unsubscribe(this.elementRef.nativeElement);
  }
}
