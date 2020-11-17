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

const routes: Routes = [
  { path: 'subjects', component: SubjectsComponent, canActivate: [AuthGuard]},
  { path: 'class-names', component: ClassNamesComponent },
  { path: 'course-codes/:subjectCode', component: CourseCodesComponent},
  { path: 'course-components/:pair', component: CourseComponentsComponent},
  { path: 'timetable-results/:subjectCode', component: TimetableResultsComponent},
  { path: 'timetable-results/:subjectCode/:courseCode', component: TimetableResultsComponent},
  { path: 'timetable-results/:subjectCode/:courseCode/:courseComponent', component: TimetableResultsComponent},
  { path: 'schedules', component: SchedulesComponent},
  { path: ':schedName/timetable-results', component: TimetableResultsComponent},
  { path: 'save-pair-options/:pair/schedules', component: SchedulesComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '/subjects'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }