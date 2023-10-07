import { Routes } from '@angular/router';
import { PipelineComponent } from './pages/pipeline/pipeline.component';
import { PipelineDetailComponent } from './pages/pipeline-detail/pipeline-detail.component';
import { PipelineDetailOverviewComponent } from './pages/pipeline-detail/partials/pipeline-detail-overview/pipeline-detail-overview.component';
import { PipelineDetailLogsComponent } from './pages/pipeline-detail/partials/pipeline-detail-logs/pipeline-detail-logs.component';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogComponent } from './pages/log/log.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'app',
    component: MainComponent,
    children: [
      {
        path:'dashboard',
        component: DashboardComponent
      },
      {
        path:'log',
        component: LogComponent
      },
      {
        path: 'pipeline',
        component: PipelineComponent
      },
      {
        path: 'pipeline/:id',
        component: PipelineDetailComponent,
        children: [
          {
            path: 'overview',
            component: PipelineDetailOverviewComponent
          },
          {
            path: 'logs',
            component: PipelineDetailLogsComponent
          },
          {
            path: '',
            redirectTo: 'overview',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: "",
        redirectTo: "/app/pipeline",
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: '/app/pipeline', pathMatch: 'full' },
];
