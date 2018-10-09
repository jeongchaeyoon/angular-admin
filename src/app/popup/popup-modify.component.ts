import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { Popup } from './popup';
import { PopupSkin } from './popup-skin';
import { PopupService } from '../../services/popup.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'popup-modify-panel',
  templateUrl: './popup-modify.component.html',
  styleUrls:['./popup.component.css']
})
export class PopupModifyComponent implements OnInit {

  popup: Popup;
  skins: PopupSkin[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private popupService: PopupService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  createPopup(): Popup {
    return new Popup();
  }

  createPopupSkin(): PopupSkin {
    return new PopupSkin();
  }

  defaultSetting(): void {
    this.popup = this.createPopup();
    this.skins[0] = this.createPopupSkin();
  }

  setLayout(): void {
    this.route.params.pipe(switchMap((params: Params) => this.popupService.getPopupJson(params['id']))).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data['list'][0];

        for ( let key in this.popup) {
          this.popup[key] = data[key];
        }
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
    });
  }

  modifyPopup(): void {

    this.popupService.modifyPopup(this.popup).subscribe(json=> {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];

        for( let key in this.popup) {
          this.popup[key] = data[key];
        }

        this.goBack();
      } else {
        console.log(json.msg);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}