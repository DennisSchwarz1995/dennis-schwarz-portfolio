import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutComponent } from './sections/about/about.component';
import { ContactComponent } from './sections/contact/contact.component';
import { HeroComponent } from './sections/hero/hero.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { SkillsComponent } from './sections/skills/skills.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ProjectsComponent,
    SkillsComponent,
    TestimonialsComponent,
    ContactComponent,
  ],
  template: `
    <main>
      <app-hero />
      <app-about />
      <app-projects />
      <app-skills />
      <app-testimonials />
      <app-contact />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}

