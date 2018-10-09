import { Component, OnInit } from '@angular/core';

import { AnalyticsPageview } from './analytics-pageview';
import { AnalyticsService } from '../../services/analytics.service';
import { StringUtilService } from '../../libs/utils/string-util.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'analytics-pageview-panel',
  templateUrl: './analytics-pageview.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsPageviewComponent implements OnInit {

  isPageviewLoaded:boolean = false;
  analytics: AnalyticsPageview[] = [];
  msg: string = '';
  isEmptyInputValue: boolean = true;

  constructor(
    private stringUtilService: StringUtilService,
    private analyticsService: AnalyticsService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.setLayout();

  }
  createPageview(): AnalyticsPageview {
    return new AnalyticsPageview();
  }

  setLayout(): void {

    this.analyticsService.getPageviewsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list;

        for (let i=0; i<list.length; i++) {
          let ap = this.createPageview();

          for (let key in ap) {
            ap[key] = list[i][key];
          }
          this.analytics.unshift(ap);
        }
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
      this.isPageviewLoaded = true;
    });
  }

  addNewItem(name: string): void {

    if (!this.validateValue(name)) {
        return;
      }

      let params = {
        keyword: name
      };
      this.analyticsService.createPageview(params).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data.list[0];
          let ap = this.createPageview();

          for (let key in ap) {
            ap[key] = data[key];
          }
          this.analytics.unshift(ap);
        } else {
          console.log(json.msg);
        }
      });
  }

  validateValue(value: any): boolean {

    if (value === '') {
      this.isEmptyInputValue = false;
      this.msg = '페이지뷰 키워드를 입력해주세요.';
      return false;
    }

    value = value.trim();

    //let reg = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9_-]{2,13}$/g;
    let reg = /^[a-zA-Z][a-zA-Z0-9_-]{2,13}$/g;
    let result = reg.test(value);

    if (!result) {
      this.isEmptyInputValue = false;
      this.msg = '페이지뷰 키워드 영문 이름이 올바르지 않습니다.';
      return false;
    }

    this.isEmptyInputValue = true;
    return true;
  }

  resetValidation(): void {
    this.isEmptyInputValue = true;
  }
}