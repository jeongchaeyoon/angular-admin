import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { AnalyticsConnectpath } from './analytics-connectpath';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'analytics-connectpath-modify-panel',
  templateUrl: './analytics-connectpath-modify.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsConnectpathModifyComponent implements OnInit {

  analytics: AnalyticsConnectpath = null;
  msg: string = '';
  isEmptyInputValue: boolean = true;

  constructor(
    private analyticsService: AnalyticsService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }
  createConnectpath(): AnalyticsConnectpath {
    return new AnalyticsConnectpath();
  }

  defaultSetting(): void {
    this.analytics = this.createConnectpath();
  }

  setLayout(): void {
    this.route.params.pipe(switchMap((params: Params) => this.analyticsService.getConnectPathJson(+params['id']))).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];

        for (let key in this.analytics) {
          this.analytics[key] = data[key];
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

  resetHitCount(): void {

    let params = {
      id: this.analytics.id,
      keyword: this.analytics.name
    };
    this.analyticsService.resetConnectpath(params).subscribe(json => {

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