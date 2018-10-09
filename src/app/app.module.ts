import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { SwiperModule, SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { AppRoutingModule } from '../router/app-routing.module';
import { PageNotFoundComponent } from './common/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { AuthGuard } from '../libs/guards/auth.guard';

import { AppComponent } from './app.component';
import { GnbComponent } from './gnb/gnb.component';
import { HomeComponent } from './home/home.component';
import { HomeChartConnectdayComponent } from './home/home-chart-connectday.component';
import { HomeChartConnectdayBgComponent } from './home/home-chart-connectday-bg.component';

import { MenusComponent } from './menus/menus.component';

import { MemberGroupComponent } from './member/member-group.component';
import { MemberGroupModifyComponent } from './member/member-group-modify.component';
import { MemberGroupDeleteComponent } from './member/member-group-delete.component';
import { MemberListComponent } from './member/member-list.component';
import { MemberModifyComponent } from './member/member-modify.component';
import { MemberDeleteComponent } from './member/member-delete.component';

import { BoardGroupComponent } from './board/board-group.component';
import { BoardGroupModifyComponent } from './board/board-group-modify.component';
import { BoardGroupDeleteComponent } from './board/board-group-delete.component';

import { DocumentComponent } from './document/document.component';
import { DocumentModifyComponent } from './document/document-modify.component';
import { DocumentDeleteComponent } from './document/document-delete.component';

import { PopupComponent } from './popup/popup.component';
import { PopupModifyComponent } from './popup/popup-modify.component';
import { PopupDeleteComponent } from './popup/popup-delete.component';

import { AnalyticsComponent } from './analytics/analytics.component';
import { AnalyticsConnectpathComponent } from './analytics/analytics-connectpath.component';
import { AnalyticsConnectpathModifyComponent } from './analytics/analytics-connectpath-modify.component';
import { AnalyticsConnectpathDeleteComponent } from './analytics/analytics-connectpath-delete.component';

import { AnalyticsPageviewComponent } from './analytics/analytics-pageview.component';
import { AnalyticsPageviewModifyComponent } from './analytics/analytics-pageview-modify.component';
import { AnalyticsPageviewDeleteComponent } from './analytics/analytics-pageview-delete.component';

import { DragListenerDirective } from '../libs/directives/drag-listener.directive';

import { GnbService } from '../services/gnb.service';
import { HomeService } from '../services/home.service';
import { MenuService } from '../services/menu.service';
import { MemberService } from '../services/member.service';
import { BoardService } from '../services/board.service';
import { DocumentService } from '../services/document.service';
import { PopupService } from '../services/popup.service';
import { AnalyticsService } from '../services/analytics.service';

import { HttpAdapterService } from '../libs/utils/http-adapter.service';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../libs/utils/alert.service';
import { StringUtilService } from '../libs/utils/string-util.service'
import { StringComparePipe } from '../libs/pipes/string-compare.pipe';
import { StringSplitPipe } from '../libs/pipes/string-split.pipe';
import { StringUppercaseAtPipe } from '../libs/pipes/string-uppercase-at.pipe';
import { NumberCommaAddPipe } from '../libs/pipes/number-comma-add.pipe';
import { NumberCommaRemovePipe } from '../libs/pipes/number-comma-remove.pipe';

const SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto',
  keyboardControl: true
};

@NgModule({
  declarations: [
    AppComponent,
    GnbComponent,
    MenusComponent,
    LoginComponent,
    RegisterComponent,

    HomeComponent,
    HomeChartConnectdayComponent,
    HomeChartConnectdayBgComponent,
    MemberGroupComponent,
    MemberGroupModifyComponent,
    MemberGroupDeleteComponent,
    MemberListComponent,
    MemberModifyComponent,
    MemberDeleteComponent,

    BoardGroupComponent,
    BoardGroupModifyComponent,
    BoardGroupDeleteComponent,

    DocumentComponent,
    DocumentModifyComponent,
    DocumentDeleteComponent,

    PopupComponent,
    PopupModifyComponent,
    PopupDeleteComponent,

    AnalyticsComponent,
    AnalyticsConnectpathComponent,
    AnalyticsConnectpathModifyComponent,
    AnalyticsConnectpathDeleteComponent,

    AnalyticsPageviewComponent,
    AnalyticsPageviewModifyComponent,
    AnalyticsPageviewDeleteComponent,

    /* directives */
    DragListenerDirective,

    StringComparePipe,
    StringSplitPipe,
    StringUppercaseAtPipe,
    NumberCommaAddPipe,
    NumberCommaRemovePipe,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule,
    SwiperModule.forRoot(SWIPER_CONFIG)
  ],
  providers: [
    GnbService,
    HomeService,
    AuthenticationService,
    MenuService,
    MemberService,
    BoardService,
    DocumentService,
    PopupService,
    AnalyticsService,

    StringUtilService,
    HttpAdapterService,
    AuthGuard,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
