import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { MemberGroup } from './member-group';
import { MemberService } from '../../services/member.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'member-group-modify-panel',
  templateUrl: './member-group-modify.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberGroupModifyComponent implements OnInit {

  groups: MemberGroup[] = null;
  group: MemberGroup;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  createMemberGroup(): MemberGroup {
    return new MemberGroup();
  }

  defaultSetting(): void {
    this.group = this.createMemberGroup();
  }

  setLayout(): void {

    this.memberService.getMemberGroupsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let list = json.data.list[0];
        let m;
        let groups = [];

        for(let i=0; i<list.length; i++) {
          m = this.createMemberGroup();
          m.group_name = list[i].group_name;
          groups.push(m);
        }

        this.groups = groups;
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
    });

    this.route.params.pipe(switchMap((params: Params) => this.memberService.getMemberGroupJson(+params['id']))).subscribe( json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];
        let m = this.createMemberGroup();
        m.id = data.id;
        m.summary = data.summary;
        m.group_name = data.group_name;
        m.header_path = data.header_path;
        m.footer_path = data.footer_path;
        m.date = data.date;

        this.group = m;
      } else {
        console.log(json.msg);
      }
    });
  }

  modifyMemberGroup(): void {

    this.memberService.updateMemberGroup(this.group).subscribe(json => {
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