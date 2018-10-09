import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { Member } from './member';
import { MemberService } from '../../services/member.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'member-delete-panel',
  templateUrl: './member-delete.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberDeleteComponent implements OnInit {

  member: Member;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private authService: AuthenticationService) {}

  createMember(): Member {
    return new Member();
  }

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  defaultSetting(): void {
    this.member = this.createMember();
  }

  setLayout(): void {

    this.route.params.pipe(switchMap((params: Params) => this.memberService.getMemberJson(+params['id']))).subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let data = json.data.list[0];
        let m = this.createMember();

        for( let key in m ) {
          m[key] = data[key];
        }
        this.member = m;
      } else {
        console.log(json.msg);

        // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
          if (json.url) {
            this.authService.serverSesstion(json.url);
          }
      }
    });
  }

  deleteMember(): void {

    let params = {
      id : this.member.id
    };

    this.memberService.deleteMember(params).subscribe(json => {

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