import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as mainReducer from '../store/main.reducer';
import * as mainActions from '../store/main.actions';
import { Subscription } from 'rxjs';
import { LoginStateEnum, RegisterStateEnum } from '../data-types/enums';
import { TransactionResultModel } from '../data-types/transaction-result-model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {

  constructor(private store:Store<mainReducer.State>) { }

  stateSubscription: Subscription;

  transactions: Array<TransactionResultModel>;

  ngOnInit() {
    this.stateSubscription = this.store.subscribe((state:any)=>{
      this.transactions = state.root.loggedUserTransactions;
    });
    this.transactions = [];
    this.store.dispatch(new mainActions.LoggedUserTransactionsStart(null));
  }

  ngOnDestroy(){
    this.stateSubscription.unsubscribe();
  }

}
