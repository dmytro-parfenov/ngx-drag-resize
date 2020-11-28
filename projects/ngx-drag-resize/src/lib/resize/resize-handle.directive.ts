import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
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
@Directive({
  selector: '[ngxResizeHandle]',
})
export class NgxResizeHandleDirective implements AfterViewInit, OnDestroy {
  /**
   * Sets the attribute which define the side the HTML element will affect during drag
   */
  @Input('ngxResizeHandle')
  @HostBinding('attr.data-ngx-resize-handle-type')
  type: NgxResizeHandleType | null = null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Optional() private readonly resizeDirective: NgxResizeDirective
  ) {}

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
