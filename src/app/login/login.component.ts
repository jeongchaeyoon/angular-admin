import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart} from '@angular/router';

import { AdminConfig } from './admin-config';

import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../libs/utils/alert.service';

@Component({
  selector: 'login-panel',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: AdminConfig;
  loading: boolean = false;
  returnUrl: string;

   @Output() gnbControlRequest = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {

    this.model = new AdminConfig();
    this.model.admin_id = 'streamux';
    this.model.admin_pwd = '1234';
  }

  ngOnInit(): void {

    this.logout();
    this.returnUrl = '/';
    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        let delstr = 'login?returnUrl=%2F';
        this.returnUrl = event.url;
        this.returnUrl = this.returnUrl.replace(delstr, '') || '/';
      }
    });
  }

  login() {

    this.loading = true;
    this.authenticationService.login(this.model.admin_id, this.model.admin_pwd)
      .subscribe(data => {
        this.router.navigate([this.returnUrl]);

        if (data.result.toUpperCase() === 'N') {
          //console.log(data.msg);
          this.loading = false;
        }
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

  logout() {

    this.gnbControlRequest.emit(false)
    this.authenticationService.logout()
      .subscribe(data => {
        //console.log('logout complete');
      });
  }
}