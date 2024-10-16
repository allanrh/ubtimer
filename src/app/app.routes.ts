import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { TimerComponent } from './timer/timer.component'

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'timer/:id', component: TimerComponent },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
