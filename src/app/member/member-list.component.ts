import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { Member } from './member';
import { MemberGroup } from './member-group';
import { MemberService } from '../../services/member.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'member-list-panel',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberListComponent implements OnInit {

  isMemberLoaded: boolean = false;
  group: MemberGroup;
  members: Member[] = [];
  searchMsg: string = '';
  msg: string = '';

  startIndex: number = 0;
  limitNum: number = 10;

  constructor(
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthenticationService) {}

  createMemberGroup(): MemberGroup {
    return new MemberGroup();
  }

  createMember(): Member {
    return new Member();
  }

  ngOnInit(): void {

    this.members = [];
    this.startIndex = 0;

    // 그룹 번호를 받아 해당 멤버 리스트를 가져온다
    this.route.params
      .pipe(switchMap((parems: Params) => this.memberService.getMemberGroupJson(+parems['id']))).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data;
          let m = this.createMemberGroup();

          for (let key in m) {
            //console.log(key, data[key]);
            if (data[key]) {
              m[key] = data[key];
            }
          }

          this.group = m;
          this.getMembers(this.startIndex);
        } else {
          console.log(json.msg);

          // 서버에서 URL 리턴 값이 전달됐을 때 세션이 종료 체크
            if (json.url) {
              this.authService.serverSesstion(json.url);
            }
        }
        this.isMemberLoaded = true;
      });
  }

  getMembers(index: number=0, limit: number=10): void {

    let params = {
      category: this.group.category,
      passover: index,
      limit: index + limit
    };

    this.memberService.getMembersJson(params).subscribe(json => {

      if (json.result.toUpperCase() === 'N') {
        this.msg = json.msg;
        return;
      }

      let dataes = json.data.list;

      for( let i=0; i<dataes.length; i++) {
        let m = this.createMember();
        let data = dataes[i];

        for(let key in m) {
          m[key] = data[key];
        }
        this.members.push(m);
      }
    });
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    $event.preventDefault();

    let winHt = window.innerHeight,
      docHt = document.body.clientHeight,
      currentY = window.scrollY,
      scrollOffset = docHt - winHt;

      if (scrollOffset === currentY) {
        this.startIndex += this.limitNum;
        this.getMembers(this.startIndex);
      }
  }

  gotoMemberModify(member: Member): void {

    this.router.navigate(['/member-modify', member.id]);
  }

  searchMember( name: string ): void {

    if (!this.validateValue(name)) {
        return;
    }
  }

  validateValue(value: any): boolean {

    if (value === '') {
      this.searchMsg = '검색할 이름을 입력해주세요.';
      return false;
    }

    value = value.trim();

    let reg = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9_-]{2,13}$/g;
    let result = reg.test(value);
    if (!result) {
      this.searchMsg = '이름이 올바르지 않습니다.';
      return false;
    }

    return true;
  }

  resetValidation(): void {
    this.searchMsg = '';
  }

  gotoBack(): void {
    this.location.back();
  }
}