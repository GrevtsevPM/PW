import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as mainReducer from '../store/main.reducer';
import * as mainActions from '../store/main.actions';
import { Subscription } from 'rxjs';
import { TransactionResultModel } from '../data-types/transaction-result-model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls:['./history.component.less']
})
export class HistoryComponent implements OnInit, OnDestroy {

  constructor(private store:Store<mainReducer.State>) { }

  stateSubscription: Subscription;

  //история транзакций
  transactions: TransactionResultModel[];

  ngOnInit() {
    //подписка на изменения store
    this.stateSubscription = this.store.subscribe((state:any)=>{
      this.transactions = state.root.loggedUserTransactions;
    });

    this.transactions = [];
    //получение истории транзакций с сервера
    this.store.dispatch(new mainActions.LoggedUserTransactionsStart(null));
  }

  ngOnDestroy(){
    this.stateSubscription.unsubscribe();
  }

  transactionsTrackBy(t){
    return t.id;
  }

}
