import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoDetail } from './medico-detail';

describe('MedicoDetail', () => {
  let component: MedicoDetail;
  let fixture: ComponentFixture<MedicoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoDetail);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});