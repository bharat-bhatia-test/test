import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true;
    }

    this.router.navigate(['/pages']);
    return false;
  }
}
