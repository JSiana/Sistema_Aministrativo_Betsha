import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPagoComponent } from './info-pago.component';

describe('InfoPagoComponent', () => {
  let component: InfoPagoComponent;
  let fixture: ComponentFixture<InfoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
