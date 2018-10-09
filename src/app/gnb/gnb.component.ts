import { Component, AfterViewInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Router } from '@angular/router';

import { GnbMenu } from './gnb-menu';
import { GnbService } from '../../services/gnb.service';
import { AuthenticationService } from '../../services/authentication.service';

declare const jQuery;

@Component({
  selector: 'gnb-panel',
  templateUrl: './gnb.component.html',
  styleUrls: ['./gnb.component.css']
})
export class GnbComponent implements AfterViewInit {

  _gnbState = false;
  @Output() gnbControlRequest = new EventEmitter<boolean>();

  logo = 'SUX';
  menus: GnbMenu[] = [];
  iconList: string[] = ['glyphicon-menu-hamburger', 'glyphicon-user', 'glyphicon-comment', 'glyphicon-list-alt', ''];

  constructor(
    private elementRef: ElementRef,
    private gnbService: GnbService,
    public authService: AuthenticationService,
    public router: Router
  ) {}

  ngAfterViewInit() {
    this.getGnbMenus();
    this.closeGnb();
  }

  createGnbMenu(): GnbMenu {
    return new GnbMenu();
  }

  get gnbState(): boolean {
    return this._gnbState;
  }

  @Input('gnbState') set gnbState(value: boolean) {

    if (value === false) {
      jQuery('.collapse').collapse('hide');
    }

    this._gnbState = value;
  }

  getGnbMenus(): void {

    this.gnbService.getGnbMenus().subscribe(json => {
      let data = json.data;

      if (data) {
        let gm = null;

        for (let i=0; i<data.length; i++) {
          gm = this.createGnbMenu();

          for( let key in gm ) {
            gm[key] = data[i][key];
          }
          this.menus.push(gm);
        }
      }
    });
  }

  openGnb(): void {
    this._gnbState = true;
    this.changeGnbRequest();
  }

  closeGnb(): void {
    this._gnbState = false;
    this.changeGnbRequest();
  }

  changeGnbRequest(): void {
    this.gnbControlRequest.emit(this._gnbState);
  }
}
