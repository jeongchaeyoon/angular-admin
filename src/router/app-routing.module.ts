import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '../app/common/page-not-found.component';
import { HomeComponent } from '../app/home/home.component';
import { LoginComponent } from '../app/login/login.component';
import { RegisterComponent } from '../app/login/register.component';

import { MenusComponent } from '../app/menus/menus.component';

import { MemberGroupComponent } from '../app/member/member-group.component';
import { MemberGroupModifyComponent } from '../app/member/member-group-modify.component';
import { MemberGroupDeleteComponent } from '../app/member/member-group-delete.component';

import { MemberListComponent } from '../app/member/member-list.component';
import { MemberModifyComponent } from '../app/member/member-modify.component';
import { MemberDeleteComponent } from '../app/member/member-delete.component';

import { BoardGroupComponent } from '../app/board/board-group.component';
import { BoardGroupModifyComponent } from '../app/board/board-group-modify.component';
import { BoardGroupDeleteComponent } from '../app/board/board-group-delete.component';

import { DocumentComponent } from '../app/document/document.component';
import { DocumentModifyComponent } from '../app/document/document-modify.component';
import { DocumentDeleteComponent } from '../app/document/document-delete.component';

import { PopupComponent } from '../app/popup/popup.component';
import { PopupModifyComponent } from '../app/popup/popup-modify.component';
import { PopupDeleteComponent } from '../app/popup/popup-delete.component';

import { AnalyticsComponent } from '../app/analytics/analytics.component';
import { AnalyticsConnectpathComponent } from '../app/analytics/analytics-connectpath.component';
import { AnalyticsConnectpathModifyComponent } from '../app/analytics/analytics-connectpath-modify.component';
import { AnalyticsConnectpathDeleteComponent } from '../app/analytics/analytics-connectpath-delete.component';

import { AnalyticsPageviewComponent } from '../app/analytics/analytics-pageview.component';
import { AnalyticsPageviewModifyComponent } from '../app/analytics/analytics-pageview-modify.component';
import { AnalyticsPageviewDeleteComponent } from '../app/analytics/analytics-pageview-delete.component';

import { AuthGuard } from '../libs/guards/auth.guard';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'menus', component: MenusComponent, canActivate: [AuthGuard] },
  { path: 'member-group', component: MemberGroupComponent, canActivate: [AuthGuard] },
  { path: 'member-group-modify/:id', component: MemberGroupModifyComponent, canActivate: [AuthGuard] },
  { path: 'member-group-delete/:id', component: MemberGroupDeleteComponent, canActivate: [AuthGuard] },
  { path: 'member-group/:id', component: MemberListComponent, canActivate: [AuthGuard] },
  { path: 'member-modify/:id', component: MemberModifyComponent, canActivate: [AuthGuard] },
  { path: 'member-delete/:id', component: MemberDeleteComponent, canActivate: [AuthGuard] },

  { path: 'board-group', component: BoardGroupComponent, canActivate: [AuthGuard] },
  { path: 'board-group-modify/:id', component: BoardGroupModifyComponent, canActivate: [AuthGuard] },
  { path: 'board-group-delete/:id', component: BoardGroupDeleteComponent, canActivate: [AuthGuard] },

  { path: 'document', component: DocumentComponent, canActivate: [AuthGuard] },
  { path: 'document-modify/:id', component: DocumentModifyComponent, canActivate: [AuthGuard] },
  { path: 'document-delete/:id', component: DocumentDeleteComponent, canActivate: [AuthGuard] },

  { path: 'popup', component: PopupComponent, canActivate: [AuthGuard] },
  { path: 'popup-modify/:id', component: PopupModifyComponent, canActivate: [AuthGuard] },
  { path: 'popup-delete/:id', component: PopupDeleteComponent, canActivate: [AuthGuard] },

  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'analytics-connectpath', component: AnalyticsConnectpathComponent, canActivate: [AuthGuard] },
  { path: 'analytics-connectpath-modify/:id', component: AnalyticsConnectpathModifyComponent, canActivate: [AuthGuard] },
  { path: 'analytics-connectpath-delete/:id', component: AnalyticsConnectpathDeleteComponent, canActivate: [AuthGuard] },

  { path: 'analytics-pageview', component: AnalyticsPageviewComponent, canActivate: [AuthGuard] },
  { path: 'analytics-pageview-modify/:id', component: AnalyticsPageviewModifyComponent, canActivate: [AuthGuard] },
  { path: 'analytics-pageview-delete/:id', component: AnalyticsPageviewDeleteComponent, canActivate: [AuthGuard] },

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot( routes )],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }