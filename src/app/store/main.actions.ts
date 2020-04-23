import { Action } from '@ngrx/store';
import { LoginStateEnum, RegisterStateEnum, NewTransactionStateEnum  } from '../data-types/enums';
import { TransactionResultModel } from '../data-types/transaction-result-model';

export const LOGIN_START = '[Login] Send to server validated credentials';
export const LOGIN_SUCCESS = '[Login] Success result from server';
export const LOGIN_FAIL = '[Login] Fail result from server';
export const REGISTER_START = '[Registration] Send to server';
export const REGISTER_SUCCESS = '[Registration] Success';
export const REGISTER_FAIL = '[Registration] Fail';
export const LOGGED_USER_INFO_START = '[LoggedUserInfo] Send to server';
export const LOGGED_USER_INFO_SUCCESS = '[LoggedUserInfo] Success';
export const TRANSACTION_START = '[New Transaction] Send to server';
export const TRANSACTION_SUCCESS = '[New Transaction] Success';
export const TRANSACTION_FAIL = '[New Transaction] Fail';
export const LOGGED_USER_TRANSACTIONS_START = '[LoggedUserTransactions] Send to server';
export const LOGGED_USER_TRANSACTIONS_SUCCESS = '[LoggedUserTransactions] Success';
export const LOGGED_USER_TRANSACTIONS_FAIL = '[LoggedUserTransactions] Fail';

export const LOGOUT = '[Logout]';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email:string, password:string }) {}
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload) {}
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: LoginStateEnum) {}
}

export class RegisterStart implements Action {
  readonly type = REGISTER_START;

  constructor(public payload: { username:string, password:string, email:string }) {}
}

export class RegisterSuccess implements Action {
  readonly type = REGISTER_SUCCESS;

  constructor(public payload) {}
}

export class RegisterFail implements Action {
  readonly type = REGISTER_FAIL;

  constructor(public payload:RegisterStateEnum ) {}
}

export class LoggedUserInfoStart implements Action {
  readonly type = LOGGED_USER_INFO_START;

  constructor(public payload) {}
}

export class LoggedUserInfoSuccess implements Action {
  readonly type = LOGGED_USER_INFO_SUCCESS;

  constructor(public payload: { name:string, balance:number }) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;

  constructor(public payload) {}
}

export class TransactionStart implements Action {
  readonly type = TRANSACTION_START;

  constructor(public payload: { name:string, amount:number }) {}
}

export class TransactionSuccess implements Action {
  readonly type = TRANSACTION_SUCCESS;

  constructor(public payload: TransactionResultModel) {}
}

export class TransactionFail implements Action {
  readonly type = TRANSACTION_FAIL;

  constructor(public payload:NewTransactionStateEnum) {}
}

export class LoggedUserTransactionsStart implements Action {
  readonly type = LOGGED_USER_TRANSACTIONS_START;

  constructor(public payload) {}
}

export class LoggedUserTransactionsSuccess implements Action {
  readonly type = LOGGED_USER_TRANSACTIONS_SUCCESS;

  constructor(public payload: TransactionResultModel[]) {}
}

export class LoggedUserTransactionsFail implements Action {
  readonly type = LOGGED_USER_TRANSACTIONS_FAIL;

  constructor(public payload) {}
}

export class STOP_ACTION implements Action {
  readonly type = 'STOP_ACTION';
  payload;
}

export type actionType = |STOP_ACTION|LoggedUserTransactionsFail|LoggedUserTransactionsStart|LoggedUserTransactionsSuccess|TransactionStart|TransactionSuccess|TransactionFail|LoginStart|LoginSuccess|LoginFail|RegisterStart|RegisterSuccess|RegisterFail|Logout|LoggedUserInfoStart|LoggedUserInfoSuccess;

