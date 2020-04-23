import { RegisterStateEnum, NewTransactionStateEnum, LoggedUserInfoStateEnum, LoginStateEnum } from '../data-types/enums';
import { UserInfoResultModel } from '../data-types/user-info-result-model';
import { TransactionResultModel } from '../data-types/transaction-result-model';
import * as mainActions from './main.actions';

/*export interface LoginPageState{
  isSending: boolean,
  result: LoginResultEnum
}*/

export interface State {
  isAuth: boolean,
  balance: number,
  username:string,

  loginPageState: LoginStateEnum,
  registerPageState: RegisterStateEnum

  newTransaction:{
    state: NewTransactionStateEnum;
    resultData: TransactionResultModel;
  }

  loggedUserTransactions:Array<TransactionResultModel>
}

export const initialState: State = {
  isAuth: false,
  balance: 0,
  username:'',

  loginPageState:LoginStateEnum.Initial,
  registerPageState: RegisterStateEnum.Initial,

  newTransaction:{
    state: NewTransactionStateEnum.Initial,
    resultData: new TransactionResultModel()
  },

  loggedUserTransactions:[]
}

export function mainReducer(
  state = initialState,
  action: mainActions.actionType
)
  {
    console.log('reducer', action.type, action.payload/*, state*/);

    switch(action.type){
      case mainActions.LOGIN_START:
        return {
          ...state, loginPageState: LoginStateEnum.Sending, id_token:null
        };

      case mainActions.LOGIN_SUCCESS:
        return {
          ...state, loginPageState: LoginStateEnum.Success, isAuth: true
        }

      case mainActions.LOGIN_FAIL:
        return {
          ...state, loginPageState: action.payload
        }

      case mainActions.REGISTER_START:
        return {
          ...state, registerPageState: RegisterStateEnum.Sending, id_token:null
        };

      case mainActions.REGISTER_SUCCESS:
        return {
          ...state, registerPageState: RegisterStateEnum.Success, isAuth: true
        }

      case mainActions.REGISTER_FAIL:
        return {
          ...state, registerPageState: action.payload
        }

      case mainActions.LOGOUT:
        return {
          initialState
        };

      case mainActions.LOGGED_USER_INFO_START:
        return {
          ...state
        };

      case mainActions.LOGGED_USER_INFO_SUCCESS:
        return {
          ...state, username: action.payload.name, balance: action.payload.balance
        }

        case mainActions.TRANSACTION_START:
          return {
            ...state, newTransaction:{...state.newTransaction, state: NewTransactionStateEnum.Sending}
          };

        case mainActions.TRANSACTION_SUCCESS:
          return {
            ...state, newTransaction:{resultData:action.payload, state: NewTransactionStateEnum.Success}, balance: action.payload.balance
          }

        case mainActions.TRANSACTION_FAIL:
          return {
            ...state, newTransaction:{...state.newTransaction, state: action.payload}
          }

        case mainActions.LOGGED_USER_TRANSACTIONS_START:
          return {
            ...state
          };

        case mainActions.LOGGED_USER_TRANSACTIONS_SUCCESS:
          return {
            ...state, loggedUserTransactions: action.payload
          }

        case mainActions.LOGGED_USER_TRANSACTIONS_FAIL:
          return {
            ...state, loggedUserTransactions: []
          }

      default:
        return state;
    }


  }
