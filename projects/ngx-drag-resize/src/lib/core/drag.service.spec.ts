import {DragService} from './drag.service';
import {TestBed} from '@angular/core/testing';

describe('DragService', () => {
  let service: DragService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DragService]
    });

    service = TestBed.inject(DragService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should create observable', () => {
    const element = document.createElement('div');

    const observable$ = service.fromElement(element);

    expect(observable$).toBeTruthy();
  });
});
