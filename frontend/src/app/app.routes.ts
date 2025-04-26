import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepensesComponent } from './depenses/depenses.component';
import { EvenementsComponent } from './evenements/evenements.component';
import { ParametresComponent } from './parametres/parametres.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full'
    },
    {
      path: '',
      component: AuthLayoutComponent,
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'signup', component: SignupComponent }
      ]
    },
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'depenses', component: DepensesComponent },
        { path: 'evenements', component: EvenementsComponent},
        { path: 'parametres', component: ParametresComponent}
      ]
    }
  ];
