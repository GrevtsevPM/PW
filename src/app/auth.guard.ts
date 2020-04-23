import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as mainReducer from './store/main.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store:Store<mainReducer.State>) {
    this.stateSubscription = this.store.subscribe((state:any)=>{
      this.isAuth=state.root.isAuth;
    });
  }

  isAuth: false;
  stateSubscription: Subscription;


  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
        if (this.isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/']);
  }
}
