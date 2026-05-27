import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentListComponent } from './pages/document-list/document-list.component';
import { DocumentDetailComponent } from './pages/document-detail/document-detail.component';
import { DocumentNewComponent } from './pages/document-new/document-new.component';
import { AiGeneratorComponent } from './pages/ai-generator/ai-generator.component';
import { VisualizationComponent } from './pages/visualization/visualization.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'documents', component: DocumentListComponent },
  { path: 'documents/new', component: DocumentNewComponent },
  { path: 'documents/:id', component: DocumentDetailComponent },
  { path: 'ai-generator', component: AiGeneratorComponent },
  { path: 'visualization/:id', component: VisualizationComponent },
];
