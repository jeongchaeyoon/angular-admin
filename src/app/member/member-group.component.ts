import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MemberGroup } from './member-group';
import { MemberService } from '../../services/member.service';
import { StringUtilService } from '../../libs/utils/string-util.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'member-group-panel',
  templateUrl: './member-group.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberGroupComponent implements OnInit {

  isMemberLoaded: boolean = false;
  msg: string = '';
  groups: MemberGroup[] = [];
  isEmptyInputValue: boolean = true;

  constructor(
    private memberService: MemberService,
    private stringUtilService: StringUtilService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {

    this.getMenus();
  }

  createMemberGroup(): MemberGroup {
    return new MemberGroup();
  }

  getMenus(): void {
    this.memberService.getMemberGroupsJson().subscribe(json => {

      if (json.result.toUpperCase() === 'Y') {
        let dataes = json.data.list;

        for(let i=0; i<dataes.length; i++) {
          let m = this.createMemberGroup();
          m.id = dataes[i].id;
          m.category = dataes[i].category;
          m.group_name = dataes[i].group_name;
          m.header_path = dataes[i].header_path;
          m.footer_path = dataes[i].footer_path;
          m.date = dataes[i].date;

          this.groups.push(m);
        }
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

  addNewItem( name: string ): void {

    if (!this.validateValue(name)) {
        return;
      }

      let m = this.createMemberGroup();
      m.category = name;
      m.group_name = name;

      this.memberService.createMemberGroup(m).subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let data = json.data[0];
          let m = this.createMemberGroup();
          m.id = data.id;
          m.category = data.category;
          m.group_name = data.group_name;
          m.header_path = data.header_path;
          m.footer_path = data.footer_path;
          m.date = data.date;

          this.groups.unshift(m);
        } else {
          console.log(json.msg);
        }
      });
  }

  validateValue(value: any): boolean {

    if (value === '') {
      this.isEmptyInputValue = false;
      this.msg = '회원그룹 이름을 입력해주세요.';
      return false;
    }

    value = value.trim();

    let reg = /^[a-zA-Z][a-zA-Z0-9_-]{2,13}$/g;
    let result = reg.test(value);

    if (!result) {
      this.isEmptyInputValue = false;
      this.msg = '회원그룹 이름이 올바르지 않습니다.';
      return false;
    }

    this.isEmptyInputValue = true;
    return true;
  }

  resetValidation(): void {
    this.isEmptyInputValue = true;
  }
}