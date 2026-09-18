import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDetail } from './consulta-detail';

describe('ConsultaDetail', () => {
  let component: ConsultaDetail;
  let fixture: ComponentFixture<ConsultaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaDetail);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});