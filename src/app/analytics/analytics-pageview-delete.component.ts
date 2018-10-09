import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { AnalyticsPageview } from './analytics-pageview';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'analytics-pageview-delete-panel',
  templateUrl: './analytics-pageview-delete.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsPageviewDeleteComponent implements OnInit {

  analytic: AnalyticsPageview = null;
  msg: string = '';
  isEmptyInputValue: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private analyticsService: AnalyticsService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  createPageview(): AnalyticsPageview {
    return new AnalyticsPageview();
  }

  defaultSetting(): void {
    this.analytic = this.createPageview();
  }

  setLayout(): void {
    this.route.params.pipe(switchMap((params: Params) => this.analyticsService.getPageviewJson(+params['id']))).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];

        for ( let key in this.analytic) {
          this.analytic[key] = data[key];
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

  deleteKeyword(): void {

    let params = {
      id: this.analytic.id,
      keytword: this.analytic.name
    };
    this.analyticsService.deletePageview(params).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        this.goBack();
      } else {
        console.log(json.msg);
      }
    })
  }

  goBack(): void {
    this.location.back();
  }
}