import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { MemberGroup } from './member-group';
import { MemberService } from '../../services/member.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'member-group-delete-panel',
  templateUrl: './member-group-delete.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberGroupDeleteComponent implements OnInit {

  group: MemberGroup;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private authService: AuthenticationService) {}

  createMemberGroup(): MemberGroup {
    return new MemberGroup();
  }

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  defaultSetting(): void {
    this.group = this.createMemberGroup();
  }

  setLayout(): void {

    this.route.params.pipe(switchMap((params: Params) => this.memberService.getMemberGroupJson(+params['id']))).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];
        let m = this.createMemberGroup();
        m.id = data.id;
        m.category = data.category;
        m.group_name = data.group_name;
        m.header_path = data.header_path;
        m.footer_path = data.footer_path;
        m.date = data.date;

        this.group = m;
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
    });
  }

  deleteMemberGroup(): void {

    let params = {
      id: this.group.id,
      category: this.group.category
    };

    this.memberService.deleteMemberGroup(params).subscribe(json => {

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