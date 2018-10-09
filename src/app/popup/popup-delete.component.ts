import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { Popup } from './popup';
import { PopupService } from '../../services/popup.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'popup-delete-panel',
  templateUrl: './popup-delete.component.html',
  styleUrls:['./popup.component.css']
})
export class PopupDeleteComponent implements OnInit {

  popup: Popup;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private popupService: PopupService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  defaultSetting(): void {
    this.popup = this.createPopup();
  }

  setLayout(): void {

    this.route.params.pipe(switchMap((params: Params) => this.popupService.getPopupJson(params['id']))).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data.list[0];

          for (let key in this.popup) {
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

  createPopup(): Popup {
    return new Popup();
  }

  deletePopup(id: number): void {

    let params = {
      id: this.popup.id,
      popup_name: this.popup.popup_name
    };

    this.popupService.deletePopup(params).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
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