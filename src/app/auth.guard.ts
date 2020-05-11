import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as mainReducer from './store/main.reducer';
import { ServerService } from './services/server.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private server:ServerService) {

  }

  stateSubscription: Subscription;


  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
        if (this.server.token==null || this.server.token=='null') {
          return this.router.createUrlTree(['/']);
        }
        else { return true; }
  }
}
