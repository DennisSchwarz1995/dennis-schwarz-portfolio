import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PORTFOLIO_SKILLS } from '../../../../core/data/portfolio.data';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TranslatePipe, ScrollRevealDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  private readonly smoothScroll = inject(SmoothScrollService);

  readonly coreSkills = computed(() => PORTFOLIO_SKILLS.filter((s) => s.category === 'core'));
  readonly exploringSkills = computed(() =>
    PORTFOLIO_SKILLS.filter((s) => s.category === 'exploring'),
  );

  readonly topologyNodes = [
    { domain: 'dennis-schwarz.dev', role: 'Angular 20 · Nginx Container' },
    { domain: 'join.dennis-schwarz.dev', role: 'Isolated App Container' },
    { domain: 'dabubble.dennis-schwarz.dev', role: 'Isolated App Container' },
    { domain: 'sharkie.dennis-schwarz.dev', role: 'Isolated App Container' },
    { domain: '/api/contact', role: 'Node.js Mail Microservice' },
  ] as const;

  scrollToContact(): void {
    void this.smoothScroll.navigateToSection('contact');
  }
}

