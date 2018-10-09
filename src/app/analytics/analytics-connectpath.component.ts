import { Component, OnInit } from '@angular/core';

import { AnalyticsConnectpath } from './analytics-connectpath';
import { AnalyticsService } from '../../services/analytics.service';
import { StringUtilService } from '../../libs/utils/string-util.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'analytics-connectpath-panel',
  templateUrl: './analytics-connectpath.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsConnectpathComponent implements OnInit {

  isConnectLoaded: boolean = false;
  analytics: AnalyticsConnectpath[] = [];
  msg: string = '';
  isEmptyInputValue: boolean = true;

  constructor(
    private analyticsService: AnalyticsService,
    private stringUtilService: StringUtilService,
    private authService: AuthenticationService) {}

  createConnectPath(): AnalyticsConnectpath {
    return new AnalyticsConnectpath();
  }

  ngOnInit(): void {
    this.setLayout();
  }

  setLayout(): void {

    this.analyticsService.getConnectPathesJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for (let i=0; i<list.length; i++) {
          let ac = this.createConnectPath();

          for(let key in ac) {
            ac[key] = list[i][key];
          }
          this.analytics.push(ac);
        }
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }

      this.isConnectLoaded = true;
    });
  }

  addNewItem(name: string): void {

    if (!this.validateValue(name)) {
        return;
      }

      let params = {
        keyword: name
      };

      this.analyticsService.createConnectSite(params).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let ac = this.createConnectPath();
          let data = json.data.list[0];

          for (let key in ac) {
            ac[key] = data[key];
          }
          this.analytics.unshift(ac);
        } else {
          console.log(json.msg);
        }
      });
  }

  validateValue(value: any): boolean {

    if (value === '') {
      this.isEmptyInputValue = false;
      this.msg = '접속 키워드 이름을 입력해주세요.';
      return false;
    }

    value = value.trim();

    //let reg = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9_-]{2,13}$/g;
    let reg = /^[a-zA-Z][a-zA-Z0-9_-]{2,13}$/g;
    let result = reg.test(value);
    if (!result) {
      this.isEmptyInputValue = false;
      this.msg = '접속 키워드 영문 이름이 올바르지 않습니다.';
      return false;
    }

    this.isEmptyInputValue = true;
    return true;
  }

  resetValidation(): void {
    this.isEmptyInputValue = true;
  }
}