import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

import { Member } from '../app/member/member';
import { MemberGroup } from '../app/member/member-group';
import { HttpAdapterService } from '../libs/utils/http-adapter.service';

@Injectable()
export class MemberService {

  constructor(private http: HttpAdapterService) { }

  getMemberGroupsJson(): Observable<any> {
    let url = `member-admin/group-json`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  getMemberGroupJson(id: number): Observable<any> {
    let url = `member-admin/group-json?id=${id}`;
    let params = new URLSearchParams();
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  createMemberGroup(json: any): Observable<any> {

    let url = `member-admin/group-add`;
    let params = new URLSearchParams();
    params.set('_method', 'insert');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  updateMemberGroup(json: any): Observable<any> {

    let url = `member-admin/group-modify`;
    let params = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  deleteMemberGroup(json: any): Observable<any> {

    var id = json.id;
    let url = `member-admin/group-delete?id=${id}`;
    let params = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  getMembersJson(json: any): Observable<any> {

    let url = `member-admin/list-json`;
    let params = new URLSearchParams();

    for( var key in json) {
      params.set(key, json[key]);
    }
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  getMemberJson(id: number): Observable<any> {

    var str_id = id.toString();
    let url = `member-admin/list-json`;
    let params = new URLSearchParams();
    params.set('id', str_id);
    params.set('callback', 'JSON_CALLBACK');

    return this.http.get(url, {params: params})
      .pipe(map(res => res.json() as any));
  }

  modifyMember(json: any): Observable<any> {

    let url = `member-admin/modify`;
    let params = new URLSearchParams();
    params.set('_method', 'update');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }

  deleteMember(json: any): Observable<any> {

    let url = `member-admin/delete`;
    let params = new URLSearchParams();
    params.set('_method', 'delete');
    params.set('callback', 'JSON_CALLBACK');

    return this.http.post(url, json, {params: params})
      .pipe(map(res => res.json() as any));
  }
}