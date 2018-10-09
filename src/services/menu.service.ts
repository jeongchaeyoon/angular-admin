import { Injectable } from '@angular/core';
import { Http, Headers, Jsonp, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Menu } from '../app/menus/menu';
import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class MenuService {

  constructor(private http: HttpAdapterService) { }

  getMenusJson(): Observable<any> {

    let url = `menu-admin/list-json`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, { params: params })
      .pipe(map(res => res.json() as any));
  }

  getMenuJson(id: number): Observable<any> {

    let url = `menu-admin/list-json?id=${id}`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, { params: params})
      .pipe(map(res => res.json() as any));
  }

  getGnbJson(): Observable<any> {

    // 추후에 json 파일로 변환
    let url = `menu-admin/gnb-list`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, { params: params})
      .pipe(map(res => res.json() as any));
  }

  addMenu(json: any): Observable<any> {

    let url = `menu-admin/menu`;
    let params = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, { params: params})
      .pipe(map(res => res.json() as any));
  }

  modifyMenu(json: any): Observable<any> {

    let url = `menu-admin/menu`;
    let params = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, { params: params})
      .pipe(map(res => res.json() as any));
  }

  deleteMenu(json: any): Observable<any> {

    let url = `menu-admin/menu`;
    let params = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, { params: params})
      .pipe(map(res => res.json() as any));
  }

  saveJson(json: any): Observable<any> {

    let url = `menu-admin/save-json`;
    let params = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params:params})
      .pipe(map(res => res.json() as any));
  }
}
