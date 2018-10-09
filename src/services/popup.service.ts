import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Popup } from '../app/popup/popup';
import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class PopupService {

  constructor(private http: HttpAdapterService) { }

  getPopupsJson(): Observable<any> {

    let url = `popup-admin/list-json`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getPopupJson(id: string): Observable<any> {

    let url = `popup-admin/modify-json`;
    let params = new URLSearchParams();
    params.set('id', id);
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  createPopup(json: any): Observable<any> {

    let url = `popup-admin/add`;
    let params = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }

  modifyPopup(json: any): Observable<any> {

    let url = `popup-admin/modify`;
    let params = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }

  deletePopup(json: any): Observable<any> {

    let url = `popup-admin/delete`;
    let params = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }
}