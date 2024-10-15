// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { TestComponent } from './test/test.component';
import { ResultComponent } from './result/result.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'test', component: TestComponent },
  { path: 'result', component: ResultComponent },
  { path: '**', redirectTo: '' } // Redirect unknown paths to Welcome
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
