import { Injectable } from '@angular/core';
import { Http, Jsonp, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { BoardGroup } from '../app/board/board-group';
import { BoardSkin } from '../app/board/board-skin';
import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class BoardService {

  constructor( private http: HttpAdapterService ) { }

  getBoardGroupsJson(): Observable<any> {

    let url = `board-admin/group-list-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getBoardGroupJson(id: number): Observable<any> {

    let str_id: string = id + '';
    let url = `board-admin/group-list-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', str_id);
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  getBoardSkinsJson(): Observable<any> {

    let url = `board-admin/skin-json`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(req => req.json() as any));
  }

  createBoardGroup(json: any): Observable<any> {

    let url = `board-admin/group-add`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }

  modifyBoardGroup(json: any): Observable<any> {

    let url = `board-admin/group-modify`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }

  deleteBoardGroup(json: any): Observable<any> {

    let url = `board-admin/group-delete`;
    let params: URLSearchParams = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(req => req.json() as any));
  }
}
