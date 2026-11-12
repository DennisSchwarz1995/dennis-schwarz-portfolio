import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PORTFOLIO_SKILLS } from '../../../../core/data/portfolio.data';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';
import { TooltipDirective } from '../../../../core/directives/tooltip.directive';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';

export type InfraLayerId = 'edge' | 'cicd' | 'proxy' | 'apps' | 'mailer';

export interface InfraLayer {
  readonly id: InfraLayerId;
  readonly index: string;
  readonly titleKey: string;
  readonly textKey: string;
  readonly chips: readonly string[];
}

export interface TopologyNode {
  readonly domain: string;
  readonly role: string;
  readonly href: string;
  readonly external: boolean;
  readonly layer: Extract<InfraLayerId, 'apps' | 'mailer'>;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TranslatePipe, ScrollRevealDirective, TooltipDirective],
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

  readonly infraLayers: readonly InfraLayer[] = [
    {
      id: 'edge',
      index: '01',
      titleKey: 'INFRA_ACC_EDGE_TITLE',
      textKey: 'INFRA_ACC_EDGE_TEXT',
      chips: ['TLS 1.3', 'HTTP/3', "Let's Encrypt", 'HSTS Preload', 'HTTP → HTTPS 301'],
    },
    {
      id: 'cicd',
      index: '02',
      titleKey: 'INFRA_ACC_CICD_TITLE',
      textKey: 'INFRA_ACC_CICD_TEXT',
      chips: ['GitHub Actions', 'Lint & Build', 'GHCR', 'SSH Deploy', 'Docker Compose'],
    },
    {
      id: 'proxy',
      index: '03',
      titleKey: 'INFRA_ACC_PROXY_TITLE',
      textKey: 'INFRA_ACC_PROXY_TEXT',
      chips: [
        'Traefik v3.2',
        'Docker Provider',
        'Label Routing',
        'ACME TLS-ALPN',
        'Security Headers',
      ],
    },
    {
      id: 'apps',
      index: '04',
      titleKey: 'INFRA_ACC_APPS_TITLE',
      textKey: 'INFRA_ACC_APPS_TEXT',
      chips: [
        'node:22-alpine',
        'nginx:1.27-alpine',
        'Multi-Stage Build',
        'Gzip',
        'Immutable Cache',
      ],
    },
    {
      id: 'mailer',
      index: '05',
      titleKey: 'INFRA_ACC_MAILER_TITLE',
      textKey: 'INFRA_ACC_MAILER_TEXT',
      chips: [
        'Node.js 22',
        'Express',
        'Nodemailer',
        'SMTP TLS · 587',
        'Helmet',
        'Rate Limiting',
        'Honeypot',
      ],
    },
  ];

  readonly topologyNodes: readonly TopologyNode[] = [
    {
      domain: 'dennis-schwarz.dev',
      role: 'Angular 20 · Nginx Container',
      href: 'https://dennis-schwarz.dev',
      external: true,
      layer: 'apps',
    },
    {
      domain: 'join.dennis-schwarz.dev',
      role: 'Isolated App Container',
      href: 'https://join.dennis-schwarz.dev',
      external: true,
      layer: 'apps',
    },
    {
      domain: 'dabubble.dennis-schwarz.dev',
      role: 'Isolated App Container',
      href: 'https://dabubble.dennis-schwarz.dev',
      external: true,
      layer: 'apps',
    },
    {
      domain: 'sharkie.dennis-schwarz.dev',
      role: 'Isolated App Container',
      href: 'https://sharkie.dennis-schwarz.dev',
      external: true,
      layer: 'apps',
    },
    {
      domain: '/api/contact',
      role: 'Node.js Mail Microservice',
      href: '#contact',
      external: false,
      layer: 'mailer',
    },
  ];

  readonly openLayer = signal<InfraLayerId | null>('proxy');

  readonly hoverLayer = signal<InfraLayerId | null>(null);

  readonly focusLayer = computed(() => this.hoverLayer() ?? this.openLayer());

  selectLayer(id: InfraLayerId): void {
    this.openLayer.set(id);
  }

  toggleLayer(id: InfraLayerId): void {
    this.openLayer.set(this.openLayer() === id ? null : id);
  }

  previewLayer(id: InfraLayerId | null): void {
    this.hoverLayer.set(id);
  }

  onRouteActionClick(event: MouseEvent, node: TopologyNode): void {
    event.stopPropagation();
    if (!node.external) {
      event.preventDefault();
      this.scrollToContact();
    }
  }

  scrollToContact(): void {
    void this.smoothScroll.navigateToSection('contact');
  }
}
