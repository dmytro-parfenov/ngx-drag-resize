import { TestBed } from '@angular/core/testing';

import { NgxDragAndResizeService } from './ngx-drag-and-resize.service';

describe('NgxDragAndResizeService', () => {
  let service: NgxDragAndResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxDragAndResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
