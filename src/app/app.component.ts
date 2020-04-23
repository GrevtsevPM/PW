import { Component, OnInit } from '@angular/core';
import { ServerService } from './services/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private server:ServerService){}
  title = 'Parrot Wings';
  inited:boolean = false;
  errorInfoText:string='';

  ngOnInit(){
    this.server.error.subscribe((errText)=>{
      this.errorInfoText = errText;
    });
    this.inited = true;
  }
}
