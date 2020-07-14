import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NbAuthComponent } from '@nebular/auth';
import { AuthGuard } from '../@theme/guards/auth-guard.service';
import { LogoutComponent } from '../@theme/components/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Login',
        },
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
