import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard';

import { PacienteList } from './features/pacientes/paciente-list/paciente-list';
import { PacienteForm } from './features/pacientes/paciente-form/paciente-form';
import { PacienteDetail } from './features/pacientes/paciente-detail/paciente-detail';

import { MedicoList } from './features/medicos/medico-list/medico-list';
import { MedicoForm } from './features/medicos/medico-form/medico-form';
import { MedicoDetail } from './features/medicos/medico-detail/medico-detail';

import { ConsultaList } from './features/consultas/consulta-list/consulta-list';
import { ConsultaForm } from './features/consultas/consulta-form/consulta-form';
import { ConsultaDetail } from './features/consultas/consulta-detail/consulta-detail';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'pacientes',
    component: PacienteList
  },

  {
    path: 'pacientes/novo',
    component: PacienteForm
  },

  {
    path: 'pacientes/:id/editar',
    component: PacienteForm
  },

  {
    path: 'pacientes/:id',
    component: PacienteDetail
  },

  {
    path: 'medicos',
    component: MedicoList
  },

  {
    path: 'medicos/novo',
    component: MedicoForm
  },

  {
    path: 'medicos/:id/editar',
    component: MedicoForm
  },

  {
    path: 'medicos/:id',
    component: MedicoDetail
  },

  {
    path: 'consultas',
    component: ConsultaList
  },

  {
    path: 'consultas/nova',
    component: ConsultaForm
  },

  {
    path: 'consultas/:id/editar',
    component: ConsultaForm
  },

  {
    path: 'consultas/:id',
    component: ConsultaDetail
  }

];