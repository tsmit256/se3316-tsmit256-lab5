import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { MessagesComponent } from './messages/messages.component';
import { ClassNamesComponent } from './class-names/class-names.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseCodesComponent } from './course-codes/course-codes.component';
import { CourseComponentsComponent } from './course-components/course-components.component';
import { TimetableResultsComponent } from './timetable-results/timetable-results.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SubjectsComponent,
    MessagesComponent,
    ClassNamesComponent,
    CourseCodesComponent,
    CourseComponentsComponent,
    TimetableResultsComponent,
    SchedulesComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
