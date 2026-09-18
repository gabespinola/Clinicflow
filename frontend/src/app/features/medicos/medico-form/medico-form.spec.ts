import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoForm } from './medico-form';

describe('MedicoForm', () => {
  let component: MedicoForm;
  let fixture: ComponentFixture<MedicoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoForm);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});