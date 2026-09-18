import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaList } from './consulta-list';

describe('ConsultaList', () => {
  let component: ConsultaList;
  let fixture: ComponentFixture<ConsultaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaList],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaList);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});