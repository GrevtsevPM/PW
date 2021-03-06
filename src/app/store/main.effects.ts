import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects'
import { map, mergeMap, tap } from 'rxjs/operators';
import { ServerService } from '../services/server.service';
import * as mainActions from './main.actions';
import * as mainReducer from './main.reducer';
import { Store, Action } from '@ngrx/store';
import { LoginStateEnum, RegisterStateEnum, NewTransactionStateEnum } from '../data-types/enums';
import { Subscription, timer } from 'rxjs';
import { TransactionResultModel } from '../data-types/transaction-result-model';

@Injectable()
export class MainEffects {
  constructor(
    private actions$: Actions,
    private store: Store<mainReducer.State>,
    private server: ServerService
  ) {}

  updateBalanceTimer:Subscription;

  //отправка формы логина на сервер
  @Effect()
  login = this.actions$.pipe(
    ofType(mainActions.LOGIN_START),
    //tap((action:Action)=>{ console.log('effect', action.type, action) }),
    mergeMap((action:mainActions.LoginStart)=>{
      return this.server.post('sessions/create', action.payload).pipe();
    }),
    map((res:any)=>{
      if(res.badStatus){
        if(res.badStatus===401)
          return new mainActions.LoginFail(LoginStateEnum.WrongCredentials);
        else
          return new mainActions.LoginFail(LoginStateEnum.Error);
      }

      this.server.token = res.body.id_token;
      return new mainActions.LoginSuccess(null);
    })
  );

  //успешный логин
  @Effect()
  loginSuccess = this.actions$.pipe(
    ofType(mainActions.LOGIN_SUCCESS, mainActions.REGISTER_SUCCESS),
    map(()=>{
      this.updateBalanceTimer = timer(2000,15000).subscribe(()=>{
        this.store.dispatch(new mainActions.LoggedUserInfoStart(null));
      });
      return new mainActions.LoggedUserInfoStart(null);
    }));

  //отправка формы регистрации на сервер
  @Effect()
  register = this.actions$.pipe(
    ofType(mainActions.REGISTER_START),
    //tap((action:Action)=>{ console.log('effect', action.type, action) }),
    mergeMap((action:mainActions.RegisterStart)=>{
      return this.server.post('users', action.payload).pipe();
    }),
    map((res:any)=>{
      if(res.badStatus){
        if(res.badStatus===400)
          return new mainActions.RegisterFail(RegisterStateEnum.EmailExists);
        else
          return new mainActions.RegisterFail(RegisterStateEnum.Error);
      }

      this.server.token = res.body.id_token;
      return new mainActions.RegisterSuccess(null);
    })
  );

  //получение информации о юзере
  @Effect()
  userInfo = this.actions$.pipe(
    ofType(mainActions.LOGGED_USER_INFO_START),
    //tap((action:Action)=>{ console.log('effect', action.type, action) }),
    mergeMap(()=>{
      return this.server.get('api/protected/user-info');
    }),
    map((res:any)=>{
      if(res.badStatus){
        this.server.printError('Error occured while getting user info');
        return new mainActions.STOP_ACTION();
      }else
        return new mainActions.LoggedUserInfoSuccess({ name: res.body.user_info_token.name, balance:res.body.user_info_token.balance });
    })
  );

  //отправка транзакции на сервер
  @Effect()
  transaction = this.actions$.pipe(
    ofType(mainActions.TRANSACTION_START),
    tap((action:Action)=>{ console.log('effect', action.type, action) }),
    mergeMap((action:mainActions.TransactionStart)=>{
      return this.server.post('api/protected/transactions', action.payload);
    }),
    map((res:any)=>{
      if(res.badStatus){
        if(res.badStatus===400)
          return new mainActions.TransactionFail(NewTransactionStateEnum.UserNotFoundOrBalanceExceeded);
        else if(res.badStatus===401)
          return new mainActions.TransactionFail(NewTransactionStateEnum.Unauthorized);
        else return new mainActions.TransactionFail(NewTransactionStateEnum.Error);
      }

      return new mainActions.TransactionSuccess({ id:res.body.trans_token.id, date:res.body.trans_token.date, dateVal:null, username:res.body.trans_token.username, amount:res.body.trans_token.amount, balance:res.body.trans_token.balance  });
    })
  );

  //транзакция успешно
  @Effect()
  transactionSuccess = this.actions$.pipe(
    ofType(mainActions.TRANSACTION_SUCCESS),
    map(()=>{
      return new mainActions.LoggedUserInfoStart(null);
    }));

  //выход
  @Effect()
  logout = this.actions$.pipe(
    ofType(mainActions.LOGOUT),
    tap((action:Action)=>{
      console.log('effect', action.type, action);
      this.server.clearErrorText(); }),
    map(()=>{
      if(this.updateBalanceTimer)this.updateBalanceTimer.unsubscribe()
      return new mainActions.STOP_ACTION();
    }
  ));

  //получение истории транзакций с сервера
  @Effect()
  loggedUserTransactions = this.actions$.pipe(
    ofType(mainActions.LOGGED_USER_TRANSACTIONS_START),
    //tap((action:Action)=>{ console.log('effect', action.type, action) }),
    mergeMap(()=>{
      return this.server.get('api/protected/transactions').pipe();
    }),
    map((res:any)=>{
      if(res.badStatus){
        this.server.printError('Error occured while getting transactions list');
        return new mainActions.LoggedUserTransactionsFail(null);
      }else
        return new mainActions.LoggedUserTransactionsSuccess(
          res.body.trans_token.map((t)=>
          <TransactionResultModel>{ date: t.date, dateVal: new Date(t.date), username: t.username, amount: t.amount, balance: t.balance })
          .sort((t1,t2)=>t2.dateVal - t1.dateVal));
    })
  );
}



