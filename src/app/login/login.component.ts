import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as mainReducer from '../store/main.reducer';
import * as mainActions from '../store/main.actions';
import { Subscription } from 'rxjs';
import { LoginStateEnum, RegisterStateEnum } from '../data-types/enums';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private router:Router, private store:Store<mainReducer.State>) { }

  registerMode:boolean = false;

  //форма Логина
  formLogin: FormGroup;
  //переменные формы Логина
  formLoginVars = {
    ShowInvalid: false,
    isSending: false,
    messages:[]
  };

  //форма регистрации
  formRegister: FormGroup;
  //переменные формы регистрации
  formRegisterVars = {
    ShowInvalid: false,
    isSending: false,
    messages:[]
  };

  stateSubscription: Subscription;

  ngOnInit() {
    this.formLogin = new FormGroup({
      'email':new FormControl(null,[Validators.required, Validators.email]),
      'password':new FormControl(null, Validators.required)
    });

    this.formRegister = new FormGroup({
      'email':new FormControl(null,[Validators.required, Validators.email]),
      'name':new FormControl(null,[Validators.required]),
      'password':new FormControl(null, Validators.required),
      'passwordRepeat':new FormControl(null, [Validators.required, this.mustMatchPasswordValidator.bind(this)]),
    });

    //подписка на данные из NgRx store
    this.stateSubscription = this.store.subscribe((state:any)=>{
      switch(state.root.loginPageState){
        case LoginStateEnum.Sending:
          this.formLoginVars.isSending=true;
          break;
        case LoginStateEnum.Success:
          this.formLoginVars.isSending=false;
          this.router.navigate(['/transaction']);
          break;
        case LoginStateEnum.WrongCredentials:
          this.formLoginVars.isSending=false;
          this.formLoginVars.messages.push('Wrong login or password')
          break;
        case LoginStateEnum.Error:
          this.formLoginVars.isSending=false;
          this.formLoginVars.messages.push('Error occured')
          break;
      }

      switch(state.root.registerPageState){
        case RegisterStateEnum.Sending:
          this.formRegisterVars.isSending=true;
          break;
        case RegisterStateEnum.Success:
          this.formRegisterVars.isSending=false;
          this.router.navigate(['/transaction']);
          break;
        case RegisterStateEnum.EmailExists:
          this.formRegisterVars.isSending=false;
          this.formRegisterVars.messages.push('Email already exists')
          break;
        case RegisterStateEnum.Error:
          this.formRegisterVars.isSending=false;
          this.formRegisterVars.messages.push('Error occured')
          break;
      }
    });
  }

  ngOnDestroy(){
    this.stateSubscription.unsubscribe();
  }

  //валидатор для проверки одинаковости полей Пароль и Повтор пароля
  mustMatchPasswordValidator():{[s:string]:boolean}{
    if(!this.formRegister)return null;
    if(this.formRegister.get('passwordRepeat').value!==this.formRegister.get('password').value)return {'mustMatch':true};
    return null;
  }

  //submit формы Логина
  formLoginSubmit(){
    this.formLoginVars.messages=[];
    if(this.formLogin.invalid){
      this.formLoginVars.ShowInvalid=true;
      if(this.formLogin.get('email').invalid)this.formLoginVars.messages.push('Please enter valid Email');
      if(this.formLogin.get('password').invalid)this.formLoginVars.messages.push('Please enter Password');
    }else{
      this.formLoginVars.ShowInvalid=false;

      this.store.dispatch(new mainActions.LoginStart({email:this.formLogin.get('email').value, password:this.formLogin.get('password').value}));
    }
  }

  //submit формы Регистрации
  formRegisterSubmit(){
    this.formRegisterVars.messages=[];
    if(this.formRegister.invalid){
      this.formRegisterVars.ShowInvalid=true;
      if(this.formRegister.get('email').invalid)this.formRegisterVars.messages.push('Please enter valid Email');
      if(this.formRegister.get('name').invalid)this.formRegisterVars.messages.push('Please enter Name');
      if(this.formRegister.get('password').invalid)this.formRegisterVars.messages.push('Please enter Password');
      if(this.formRegister.get('passwordRepeat').invalid){
        if(this.formRegister.get('passwordRepeat').errors.required)this.formRegisterVars.messages.push('Please repeat Password');
        if(this.formRegister.get('passwordRepeat').errors.mustMatch)this.formRegisterVars.messages.push('Passwords are not equal');
      }
    }else{
      this.formRegisterVars.ShowInvalid=false;

      this.store.dispatch(new mainActions.RegisterStart({username:this.formRegister.get('name').value, email:this.formRegister.get('email').value, password:this.formRegister.get('password').value}));
    }
  }
}
