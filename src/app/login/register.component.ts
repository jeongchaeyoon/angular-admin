import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { AdminConfig } from './admin-config';

@Component({
  selector: 'register-panel',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent implements OnInit {

  returnUrl: string;
  loading: boolean = false;
  model: AdminConfig = null;
  newPwdConf: string = '';

  constructor(
    private location: Location,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute ) {}

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.model = this.createAdminConfig();
    /*this.model.admin_id = 'admin';
    this.model.admin_pwd = '1234';
    this.model.admin_newpwd = '1234';
    this.model.admin_email = 'streamux@naver.com';
    this.model.yourhome = 'localhost';*/
  }

  createAdminConfig(): AdminConfig {
    return new AdminConfig();
  }

  register(): void {

    if (this.model.admin_newpwd !== this.newPwdConf) {
      console.log('신규 비빌번호가 잘못되었습니다. 다시 입력해주세요.')
      return;
    }

    this.authService.register(this.model).subscribe(data=> {

      this.router.navigate([this.returnUrl]);

      if (data.result.toUpperCase() === 'N') {
        console.log(data.msg);
        this.loading = false;
      }
    },
    error => {
      this.loading = false;
    });
  }

  goBack(): void {
    this.location.back();
  }
}