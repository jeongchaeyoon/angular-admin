import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { AnalyticsConnectpath } from '../app/analytics/analytics-connectpath';
import { AnalyticsPageview } from '../app/analytics/analytics-pageview';
import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class AnalyticsService {

  constructor(private http: HttpAdapterService) { }

  /**
   * Connect
   */
  getConnectPathesJson(): Observable<any> {

    let url = `analytics-admin/connect-site-list-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  getConnectPathJson(id: number): Observable<any> {

    let url = `analytics-admin/connect-site-list-json?id=${id}`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  createConnectSite(json: any): Observable<any> {

    let url = `analytics-admin/connect-site-add`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  resetConnectpath(json: any): Observable<any> {

    let url = `analytics-admin/connect-site-reset`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  deleteConnectpath(json: any): Observable<any> {

    let url = `analytics-admin/connect-site-delete`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  /**
   * Pageview
   */
  getPageviewsJson(): Observable<any> {

    let url = `analytics-admin/pageview-list-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  getPageviewJson(id: number): Observable<any> {

    let url = `analytics-admin/pageview-list-json?id=${id}`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  createPageview(json: any): Observable<any> {

    let url = `analytics-admin/pageview-add`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  resetPageview(json: any): Observable<any> {

    let url = `analytics-admin/pageview-reset`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  deletePageview(json: any): Observable<any> {

    let url = `analytics-admin/pageview-delete`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }
}