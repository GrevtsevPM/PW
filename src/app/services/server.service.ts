import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subject, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({providedIn:'root'})
export class ServerService {
  constructor(private http: HttpClient){}

  readonly apiUrl:string='http://193.124.114.46:3001/';

  error = new Subject<string>();
  token:string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IkEiLCJlbWFpbCI6ImFAYS5hIiwiaWQiOjE3OSwiYmFsYW5jZSI6NTAwLCJpYXQiOjE1ODc0OTE2MTksImV4cCI6MTU4NzUwOTYxOX0.8m-0VH6ZgdGqYhwhh4Jx77LrNpkycJu7WzMsGcUgyFQ';//null;

  post(methodName:string, data){
    let headers=this.token===null?new HttpHeaders():new HttpHeaders({ 'Authorization': 'Bearer '+this.token });
    return this.http.post(this.apiUrl+methodName, data, {
      observe:'response', headers
    })
      .pipe(catchError((error)=>{
        console.log(error);
        return this.handleError(error);
      }));
  }

  get(methodName:string){
    let headers=this.token===null?new HttpHeaders():new HttpHeaders({ 'Authorization': 'Bearer '+this.token });
    return this.http.get(this.apiUrl+methodName, { observe:'response', headers })
      .pipe(catchError((error)=>{
        console.log(error);
        return this.handleError(error);
      }));
  }

  handleError(error: HttpErrorResponse) {
    console.log('error.status',error.status);
    if(error.status<400 || error.status>401){

      console.log(JSON.stringify(error));

      let errorMessage = 'Unknown error';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `${error.error.message}`;
      } else {
        errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
      }
      this.printError(errorMessage);
      //return throwError(errorMessage);
      return of({ badStatus: error.status });
    }else{
      return of({ badStatus: error.status });
    }
  }

  printError(text:string){
    this.error.next('Error occured. Please reload page and try again. '+text);
  }

  clearErrorText(){
    this.error.next('');
  }

  logout(){
    this.token = null;
  }
}