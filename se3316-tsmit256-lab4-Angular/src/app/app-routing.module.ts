import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectsComponent } from './subjects/subjects.component';
import { ClassNamesComponent } from './class-names/class-names.component';
import { CourseCodesComponent } from './course-codes/course-codes.component';
import { CourseComponentsComponent } from './course-components/course-components.component';
import { TimetableResultsComponent } from './timetable-results/timetable-results.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { AuthGuard } from './_helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { AccntVerificationComponent } from './accnt-verification/accnt-verification.component';
import { KeywordSearchComponent } from './keyword-search/keyword-search.component';

const routes: Routes = [
  { path: 'subjects', component: SubjectsComponent},
  { path: 'class-names', component: ClassNamesComponent, canActivate: [AuthGuard]},
  { path: 'course-codes/:subjectCode', component: CourseCodesComponent},
  { path: 'course-components/:pair', component: CourseComponentsComponent},
  { path: 'timetable-results/:subjectCode', component: TimetableResultsComponent},
  { path: 'timetable-results/:subjectCode/:courseCode', component: TimetableResultsComponent},
  { path: 'timetable-results/:subjectCode/:courseCode/:courseComponent', component: TimetableResultsComponent},
  { path: 'schedules', component: SchedulesComponent, canActivate: [AuthGuard]},
  { path: ':schedName/timetable-results', component: TimetableResultsComponent, canActivate: [AuthGuard]},
  { path: 'save-pair-options/:pair/schedules', component: SchedulesComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'verification/:link', component: AccntVerificationComponent},
  { path: 'keyword-search', component: KeywordSearchComponent},
  { path: '**', redirectTo: '/subjects'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }