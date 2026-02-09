import { TestBed } from '@angular/core/testing';

import { AlumnoGrupoService } from './alumno-grupo.service';

describe('AlumnoGrupoService', () => {
  let service: AlumnoGrupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlumnoGrupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
