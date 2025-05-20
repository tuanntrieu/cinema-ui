import { TestBed } from '@angular/core/testing';

import { MovieTypeService } from './movie-type.service';

describe('MovieTypeService', () => {
  let service: MovieTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
