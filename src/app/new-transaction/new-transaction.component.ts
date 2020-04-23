import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from '../services/server.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as mainReducer from '../store/main.reducer';
import * as mainActions from '../store/main.actions';
import { NewTransactionStateEnum } from '../data-types/enums';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html'
})
export class NewTransactionComponent implements OnInit {
  @ViewChild('formTransactionRef') formTransactionRef: NgForm;

  constructor(private server:ServerService, private store:Store<mainReducer.State>) { }

  recipientName:string='';
  amount:string='';

  recipientSuggestions:[] = [];

  formTransactionVars = {
    ShowInvalid:false,
    isSending: false,
    messages:[],
    lastTransactionInfoMsg:''
  }

  stateSubscription: Subscription;

  ngOnInit() {
    this.stateSubscription = this.store.subscribe((state:any)=>{
      if(!state.root.newTransaction)return;
      switch(state.root.newTransaction.state){
        case NewTransactionStateEnum.Initial:
          this.formTransactionVars.lastTransactionInfoMsg='';
          break;
        case NewTransactionStateEnum.Sending:
          this.formTransactionVars.isSending=true;
          this.formTransactionVars.lastTransactionInfoMsg='';
          break;
        case NewTransactionStateEnum.Success:
          this.formTransactionVars.isSending=false;
          this.formTransactionVars.lastTransactionInfoMsg=
            `${state.root.newTransaction.resultData.date} Transaction processed: sent ${state.root.newTransaction.resultData.amount} to ${state.root.newTransaction.resultData.username}`;
          break;
        case NewTransactionStateEnum.UserNotFoundOrBalanceExceeded:
          this.formTransactionVars.isSending=false;
          this.formTransactionVars.lastTransactionInfoMsg='Transaction was not made: Balance exceeded or user not found.';
          break;
        case NewTransactionStateEnum.Error:
        case NewTransactionStateEnum.Unauthorized:
          this.formTransactionVars.isSending=false;
          this.formTransactionVars.lastTransactionInfoMsg='Transaction was not made: user not found or error.';
          break;
      }
    });
  }

  recipientSearch(ev){
    let filter = ev.query;
    console.log(filter);

    this.server.post('api/protected/users/list', {filter})
    .subscribe((res:any)=>{
      console.log(res.body);
      if(!res.badStatus){
        this.recipientSuggestions=res.body.map((v)=>{ return v.name });
      }
    });
  }

  recipientOnChange(){
    console.log('recipientOnChange',this.recipientName);

  }

  isNameValid(){
    return this.recipientName.length>0;
  }

  formTransactionSubmit(){
    console.log('form',this.formTransactionRef.controls);

    this.formTransactionVars.ShowInvalid=true;
    this.formTransactionVars.messages=[];

    let allValid = this.formTransactionRef.valid;
    let amount = 0;
    if(this.formTransactionRef.controls.name.invalid)this.formTransactionVars.messages.push('Enter valid Name');
    if(this.formTransactionRef.controls.amount.invalid){
        this.formTransactionVars.messages.push('Not valid Amount');
    }else{
      this.amount=this.amount.toString().replace(',','.');
      amount = parseFloat(this.amount);
      if(isNaN(amount)){
        this.formTransactionRef.controls.amount.setErrors({ 'invalid':true });
        allValid=false;
      }
    }

    if(allValid){
      this.store.dispatch(new mainActions.TransactionStart({name:this.recipientName, amount}));

      /*this.formTransactionVars.isSending=true;
      //send
      this.server.post('api/protected/transactions', {name:this.recipientName, amount:this.amount})
      .subscribe((res:any)=>{
        console.log('transaction res',res);
        //server returned 400 or 401
        if(res.badStatus){
          console.log('badStatus',res.badStatus);
          if(res.badStatus===400)
            this.formTransactionVars.messages.push('Transaction not processed. User not found or not enough balance.');
          else if(res.badStatus===401){
            this.formTransactionVars.messages.push('Transaction not processed. Authentication error.');
          }
        }else{
          this.formTransactionVars.messages.push(`${res.body.trans_token.date} Transaction processed: sent ${res.body.trans_token.amount} to ${res.body.trans_token.username}`);;
        }
        this.formTransactionVars.isSending = false;
      });*/
    }

    console.log('allValid',allValid);

    //console.log('sendClick', this.formTransaction.errors);
  }
}
