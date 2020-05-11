export enum LoginStateEnum {
  Initial,
  Error,
  Success,

  Sending,
  WrongCredentials
}

export enum RegisterStateEnum {
  Initial,
  Error,
  Success,

  Sending,
  EmailExists
}

export enum NewTransactionStateEnum {
  Initial,
  Error,
  Success,
  Unauthorized,

  Sending,
  UserNotFoundOrBalanceExceeded
}

export enum LoggedUserInfoStateEnum {
  Initial,
  Error,
  Success,
  Unauthorized,

  UserNotFound
}

export enum FilteredUserListStateEnum {
  Initial,
  Error,
  Success,
  Unauthorized
}
