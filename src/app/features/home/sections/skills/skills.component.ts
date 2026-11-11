import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PORTFOLIO_SKILLS } from '../../../../core/data/portfolio.data';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';

export interface TopologyNode {
  readonly domain: string;
  readonly role: string;
  readonly href: string;
  readonly external: boolean;
}

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

  readonly topologyNodes: readonly TopologyNode[] = [
    {
      domain: 'dennis-schwarz.dev',
      role: 'Angular 20 · Nginx Container',
      href: 'https://dennis-schwarz.dev',
      external: true,
    },
    {
      domain: 'join.dennis-schwarz.dev',
      role: 'Isolated App Container',
      href: 'https://join.dennis-schwarz.dev',
      external: true,
    },
    {
      domain: 'dabubble.dennis-schwarz.dev',
      role: 'Isolated App Container',
      href: 'https://dabubble.dennis-schwarz.dev',
      external: true,
    },
    {
      domain: 'sharkie.dennis-schwarz.dev',
      role: 'Isolated App Container',
      href: 'https://sharkie.dennis-schwarz.dev',
      external: true,
    },
    {
      domain: '/api/contact',
      role: 'Node.js Mail Microservice',
      href: '#contact',
      external: false,
    },
  ];

  onRouteClick(event: MouseEvent, node: TopologyNode): void {
    if (!node.external) {
      event.preventDefault();
      this.scrollToContact();
    }
  }

  scrollToContact(): void {
    void this.smoothScroll.navigateToSection('contact');
  }
}
