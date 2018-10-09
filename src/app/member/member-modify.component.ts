import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm, AbstractControl } from '@angular/forms';

import { switchMap } from 'rxjs/operators';

import { StringUtilService } from '../../libs/utils/string-util.service';

import { Member } from './member';
import { MemberGroup } from './member-group';
import { MemberService } from '../../services/member.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'member-modify-panel',
  templateUrl: './member-modify.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberModifyComponent implements OnInit {

  memberForm: NgForm;
   @ViewChild('memberForm') currentForm: NgForm;

  groups: MemberGroup[];
  member: Member;
  passwordAlert: string = 'alert alert-danger';
  passwordMsg: string = '';

  password_conf: string = '';
  passwordConfAlert: string = 'alert alert-danger';
  passwordConfMsg: string = '';

  isEmptyEmail: boolean = true;
  email: string = '';
  email_tail: string = '';
  emailMsg: string = '';
  emailAlert: string = 'alert alert-danger';

  hobby: string[] = [];

  // 추 후 분리해서 common 폴더에 관리
  jobList: string[] = ['선택하기','프리랜서','교수','교사','학생','기업인','회사원','정치인','주부','농어업','기타'];
  hobbyList: string[] = ['인터넷 ','여행','낚시','바둑','기타'];
  pathList: string[] = ['선택하기','키워드검색','네이버지식인','다음카페','학교소개','주변소개','기타'];
  ynList: object[] = [{key: 'y', value: 'yes'}, {key: 'n', value: 'no'}];
  gradeList = [];

  formErrors = {
    'password': '',
    'password_conf': '',
    'user_name': '',
    'email': '',
    'email_tail': ''
  };

  validationMessages = {
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 8 characters long.',
      'maxlength': 'Password cannot be more than 24 characters long.'
    },
    'password_conf': {
      'required': 'Password is required.'
    },
    'user_name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'Email is required.'
    },
    'email_tail': {
      'required': 'Email Domain is required.'
    }
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private memberService: MemberService,
    private stringUtil: StringUtilService,
    private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.defaultSetting();
    this.setLayout();
  }

  createMember(): Member {
    return new Member();
  }

  createMemberGroup(): MemberGroup {
    return new MemberGroup();
  }

  defaultSetting(): void {
    for(let i=0; i<10; i++) {
      this.gradeList.push(i);
    }

    this.member = this.createMember();
  }

  setLayout(): void {

    this.memberService.getMemberGroupsJson()
      .subscribe( json => {

        if (json.result.toUpperCase() === 'Y') {
          let dataes = json.data as any[];
          let m;
          let groups = [];

          for(let i=0; i<dataes.length; i++) {
            m = this.createMemberGroup();
            m.id = dataes[i].id;
            m.category = dataes[i].category;
            m.group_name = dataes[i].group_name;
            m.header_path = dataes[i].header_path;
            m.footer_path = dataes[i].footer_path;
            m.date = dataes[i].date;

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

    this.route.params
      .pipe(switchMap((params: Params) =>  this.memberService.getMemberJson(+params['id'])))
      .subscribe(json => {

        if (json.result.toUpperCase() === 'Y') {
          let reg = /^email/;
          let selectReg = /^(job|join_path)$/;
          let checkboxReg = /^hobby$/;
          let data = json.data.list[0];
          let m = this.createMember();

          for( let key in m ) {
            m[key] = data[key];

            if (reg.test(key)) {
              let emailAddress = m[key].split('@');
              this.email = emailAddress[0];
              this.email_tail = emailAddress[1];
            }

            if (selectReg.test(key)) {
              if (m[key].trim() === '') {
                m[key] = '선택하기';
              }
            }

            if (checkboxReg.test(key)) {
              this.hobby = m[key].split(',');
            }
          }
          this.member = m;
        } else {
          console.log(json.msg);
        }
      });
  }

  ngAfterViewChecked(): void {
    this.changedForm();
  }

  changedForm(): void {

    if (this.currentForm === this.memberForm) { return };

    this.memberForm = this.currentForm;
    if (this.memberForm) {
      this.memberForm.valueChanges.subscribe(data => {
        this.onValueChanged(data);
      });
    }
  }

  onValueChanged(data?: any) {

    if (!this.memberForm) { return; }
    let form = this.memberForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      let control = form.get(field);

      if (control && control.dirty && !control.valid) {
        let messages = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  validatePassword(): boolean {

    let el = this.elementRef.nativeElement;
    let password = el.querySelector('#password');
    let val = password.value;
    let regExp;
    let bool;

    regExp = /[_!@#$%^&*~]+/;
    bool = regExp.test(val);
    if (bool === false) {
      this.passwordMsg = 'Special Letter must be at least 1 characters long.',
      this.passwordAlert = 'alert alert-danger';

      return false;
    }

    regExp = /[a-zA-Z]+/;
    bool = regExp.test(val);
    if (bool === false) {
      this.passwordMsg = 'English Letter must be at least 1 characters long.',
      this.passwordAlert = 'alert alert-danger';

      return false;
    }

    regExp = /[0-9]+/;
    bool = regExp.test(val);
    if (bool === false) {
      this.passwordMsg = 'Number Letter must be at least 1 characters long.',
      this.passwordAlert = "alert alert-danger";

      return false;
    }

    this.passwordMsg = 'Password is valid.';
    this.passwordAlert = 'alert alert-success';

    return true;
  }

  completePassword(): void {

    let el = this.elementRef.nativeElement;
    let password = el.querySelector('#password');
    let form = this.memberForm.form;
    let passwordCtrl:AbstractControl = form.controls['password'];

    if (this.validatePassword() || passwordCtrl.pristine) {
      this.passwordMsg = '';
    }

    if (password.value === '') {
      this.passwordMsg = '';
      passwordCtrl.reset();
    }
  }

  validatePasswordConf(): boolean {

    let el = this.elementRef.nativeElement;
    let password = el.querySelector('#password');
    let passwordConf = el.querySelector('#password_conf');
    let userName = el.querySelector('#user_name');
    let regVal = password.value.trim();
    let passwordReg = new RegExp(regVal);
    let confVal = passwordConf.value.trim();
    let isPassword = this.validatePassword();

    if (isPassword) {
      this.passwordMsg = '';
    }

    if (passwordReg.test(confVal) && regVal !== '' && isPassword === true) {
      this.passwordConfMsg =  'Password Confirm is valid.';
      this.passwordConfAlert = 'alert alert-success';

      return true;
    }  else {
      this.passwordConfMsg = 'Password Confirm is incorrect';
      this.passwordConfAlert = "alert alert-danger";

      return false;
    }
  }

  completePasswordConf(): void {

    let el = this.elementRef.nativeElement;
    let password = el.querySelector('#password');
    let passwordConf = el.querySelector('#password_conf');
    let form = this.memberForm.form;
    let passwordCtrl:AbstractControl = form.controls['password'];
    let passwordConfCtrl:AbstractControl = form.controls['password_conf'];

    if (passwordCtrl.pristine || password.value === '') {
      this.passwordMsg = '';
      this.passwordConfMsg = '';
      passwordConfCtrl.reset();

      return;
    }

    if (this.validatePassword()) {
      this.passwordMsg = '';
    }

    if (passwordConfCtrl.pristine || passwordConf.value === '') {
      this.passwordConfMsg = '';
    }

    if (this.validatePasswordConf()) {
      this.passwordConfMsg = '';
    }
  }

  completeUserName(): void {

    let form = this.memberForm.form;
    let nameCtrl:AbstractControl = form.controls['user_name'];
    let el = this.elementRef.nativeElement;
    let userName = el.querySelector('#user_name');
    let userNameValue = userName.value.trim();

    if (userNameValue === '') {
      nameCtrl.reset();
      //userName.focus();
    }
  }

  validateEmail(): boolean {

    this.member.email_address = this.email + '@' + this.email_tail;
    let bool = this.stringUtil.validateEmail(this.member.email_address);

    if (bool === false) {
      this.emailMsg = 'Email is not valid';
      this.emailAlert = "alert alert-danger";
      return false;
    } else {
      this.emailMsg = 'Email is valid.';
      this.emailAlert = "alert alert-success";
      return true;
    }
  }

  completeEmail(e): void {

    let el = this.elementRef.nativeElement;
    let email = el.querySelector('#email');
    let emailTail = el.querySelector('#email_tail');
    let form = this.memberForm.form;
    let emailCtrl:AbstractControl = form.controls['email'];
    let emailTailCtrl:AbstractControl = form.controls['email_tail'];

    if (this.validateEmail() || (emailCtrl.pristine === true && emailTailCtrl.pristine === true)) {
      this.emailMsg = '';
    }

    if (email.value === '' && emailTail.value === '') {
      this.emailMsg = '';
      emailCtrl.reset();
      emailTailCtrl.reset();
    }
  }

  changeHobby(e): void {

    let isChecked: boolean = e.target.checked;
    let value: string = e.target.value.trim();

    if (isChecked === true) {
      this.hobby.push(value)
    } else if (this.hobby.length > 0) {

      for (let i=this.hobby.length-1;  i>=0; i--) {
        let hobby: string = this.hobby[i].trim();

        if (hobby === value) {
          this.hobby.splice(i,1);
          break;
        }
      }
    }

    this.member.hobby = this.hobby.toString();
  }

  onSubmit(): void {

    if (!this.memberForm) { return; }
    let el = this.elementRef.nativeElement;
    let form: AbstractControl = this.memberForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      let control = form.get(field);

      if (control.value.trim() === '') {
        let focusable = el.querySelector('#'+field);
        let messages = this.validationMessages[field];

        for (let key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
          focusable.focus();

          return;
        }
      }
    }

    this.memberService.modifyMember(this.member).subscribe(json=> {

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