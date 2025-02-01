# ngx-drag-resize

The Angular library provides opportunity to use drag and resize functionality on HTML element.

## Demo

[ngx-drag-resize](https://ngx-drag-resize.web.app/)

## Install

NPM: `npm install ngx-drag-resize --save`

Yarn: `yarn add ngx-drag-resize`

## Usage

Ensure your component imports all required directives.

```
import {
  NgxDragDirective,
  NgxDragHandleDirective,
  NgxResizeDirective,
  NgxResizeHandleDirective
} from 'ngx-drag-resize';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgxResizeDirective, NgxResizeHandleDirective, NgxDragDirective, NgxDragHandleDirective]
})
export class AppComponent {}
```

Use directives within your template.

_Simple drag._

```
<div ngxDrag>drag me</div>
```

_Initiates only when dragging handle._

```
<div ngxDrag>
  <span>drag me</span>
  <span ngxDragHandle>handle</span>
</div>
```

_A simple resize works only via scrolling or using two fingers on touch devices._

```
<div ngxResize>resize me</div>
```

_Resize using borders, and style all elements as desired._

```
<div ngxResize>
  <span>resize me</span>
  <div [ngxResizeHandle]="NgxResizeHandleType.TopLeft"></div>
  <div [ngxResizeHandle]="NgxResizeHandleType.Top"></div>
  <div [ngxResizeHandle]="NgxResizeHandleType.TopRight"></div>
  <div [ngxResizeHandle]="NgxResizeHandleType.Right"></div>
  <div [ngxResizeHandle]="NgxResizeHandleType.BottomRight"></div>
  <div [ngxResizeHandle]="NgxResizeHandleType.Bottom"></div>
  <div [ngxResizeHandle]="NgxResizeHandleType.BottomLeft"></div>
  <div [ngxResizeHandle]="NgxResizeHandleType.Left"></div>
</div>
```

You can find more examples in the [demo app](https://github.com/dmytro-parfenov/ngx-drag-resize/tree/master/projects/ngx-drag-resize-demo)

## Documentation

[Docs page](https://dmytro-parfenov.github.io/ngx-drag-resize/)
