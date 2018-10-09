import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams, Response } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class HomeService {

  constructor(private http: HttpAdapterService) { }

  getMainJson(): Observable<any> {

    let url = `admin-admin/main-json`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getConnectdayJsonData(): Observable<any> {

    let url = `admin-admin/connectday-json`;
    let params = new URLSearchParams();
    params.set('passover', '0');
    params.set('limit', '5');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getNewmemberData(): Observable<any> {

    let url = `admin-admin/newmember-json`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getNewcommentData(): Observable<any> {

    let url = `admin-admin/latestcomment-json`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return errMsg;
  }
}