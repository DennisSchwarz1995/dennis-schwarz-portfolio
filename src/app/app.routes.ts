import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Dennis Schwarz — Frontend Developer & Web Engineer',
  },
  {
    path: 'legal-notice',
    loadComponent: () =>
      import('./features/legal/legal-notice/legal-notice.component').then(
        (m) => m.LegalNoticeComponent,
      ),
    title: 'Impressum / Legal Notice — Dennis Schwarz',
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./features/legal/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent,
      ),
    title: 'Datenschutz / Privacy Policy — Dennis Schwarz',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
