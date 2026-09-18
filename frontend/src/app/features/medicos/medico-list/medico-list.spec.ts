import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoList } from './medico-list';

describe('MedicoList', () => {
  let component: MedicoList;
  let fixture: ComponentFixture<MedicoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoList],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicoList);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});