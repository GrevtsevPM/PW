import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { HistoryComponent } from './history/history.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'transaction', component:NewTransactionComponent, canActivate:[AuthGuard]},
  {path:'history', component:HistoryComponent, canActivate:[AuthGuard]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
