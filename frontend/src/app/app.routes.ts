import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepensesComponent } from './depenses/depenses.component';
import { EvenementsComponent } from './evenements/evenements.component';
import { ParametresComponent } from './parametres/parametres.component';
import { authGuard, loginGuard, colocationGuard } from './auth.guard';
import { ColocationComponent } from './colocation/colocation.component';
import { ColocationLayoutComponent } from './layouts/colocation-layout/colocation-layout.component';

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
        { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
        { path: 'signup', component: SignupComponent, canActivate: [loginGuard] },
      ]
    },
    {
      path: '',
      component: ColocationLayoutComponent,
      children: [
        { path: 'colocation', component: ColocationComponent, canActivate: [colocationGuard] }
      ]
    },
    {
      path: '',
      component: MainLayoutComponent,
      canActivate: [authGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'depenses', component: DepensesComponent },
        { path: 'evenements', component: EvenementsComponent},
        { path: 'parametres', component: ParametresComponent}
      ]
    }
  ];
