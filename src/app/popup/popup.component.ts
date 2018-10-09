import { Component, OnInit } from '@angular/core';

import { Popup } from './popup';
import { PopupService } from '../../services/popup.service';
import { StringUtilService } from '../../libs/utils/string-util.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'popup-panel',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  isPopupLoaded: boolean = false;
  isEmptyInputValue: boolean = true;
  msg: string = '';
  popups: Popup[] = [];

  constructor(
    private stringUtilService: StringUtilService,
    private popupService: PopupService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.setLayout();
  }

  createPopup(): Popup {
    return new Popup();
  }

  setLayout(): void {

    this.popupService.getPopupsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for (let i=0; i<list.length; i++) {

          let pop = this.createPopup();
          for( let key in pop) {
            pop[key] = list[i][key];
          }

          this.popups.push(pop);
        }
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
      this.isPopupLoaded = true;
    });
  }

  addNewItem( name: string ): void {

    if (!this.validateValue(name)) {
        return;
      }

      let pop = this.createPopup();
      pop.popup_name = name;

      this.popupService.createPopup(pop).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data.list[0];

          for( let key in pop) {
            pop[key] = data[key];
          }
          this.popups.unshift(pop);
        } else {
          console.log( json.msg);
        }
      });
  }

  validateValue(value: any): boolean {

    if (value === '') {
      this.isEmptyInputValue = false;
      this.msg = '팝업 이름을 입력해주세요.';
      return false;
    }

    value = value.trim();

    let reg = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9_-\s]{2,}$/g;
    let result = reg.test(value);

    if (!result) {
      this.isEmptyInputValue = false;
      this.msg = ' 팝업 이름이 올바르지 않습니다.';
      return false;
    }

    this.isEmptyInputValue = true;
    return true;
  }

  resetValidation(): void {
    this.isEmptyInputValue = true;
  }
}