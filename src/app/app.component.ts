import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  gnbState: boolean = false;

  closeGnb(value: boolean): void {
    this.gnbState = value;
  }
}