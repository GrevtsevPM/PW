import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { Store } from '@ngrx/store';
import * as mainReducer from '../store/main.reducer';
import * as mainActions from '../store/main.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private router:Router, private server: ServerService, private store:Store<mainReducer.State>) { }

  balance = '';
  username = '';

  balanceVis:boolean = false;

  stateSubscription: Subscription;

  ngOnInit() {
    this.stateSubscription = this.store.subscribe((state:any)=>{
      this.username = state.root.username;
      if(state.root.balance)this.balance = state.root.balance.toFixed(2);
    });
  }

  ngOnDestroy(){
    this.stateSubscription.unsubscribe();
  }

  logout(){
    this.server.logout();
    this.store.dispatch(new mainActions.Logout(null));
    this.router.navigate(['/']);
  }

  history(){
    this.router.navigate(['/history']);
  }

  transaction(){
    this.router.navigate(['/transaction']);
  }
}
