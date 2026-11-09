import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { PORTFOLIO_PROJECTS } from '../../../../core/data/portfolio.data';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';
import { ProjectItem } from '../../../../core/models/portfolio.models';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [TranslatePipe, ScrollRevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly smoothScroll = inject(SmoothScrollService);

  readonly projects = PORTFOLIO_PROJECTS;
  readonly activeProject = signal<ProjectItem | null>(null);

  openProject(project: ProjectItem): void {
    this.activeProject.set(project);
    this.smoothScroll.setScrollLocked(true);
  }

  closeProject(): void {
    this.activeProject.set(null);
    this.smoothScroll.setScrollLocked(false);
  }

  stepProject(delta: 1 | -1): void {
    const current = this.activeProject();
    if (!current) {
      return;
    }
    const idx = this.projects.findIndex((p) => p.id === current.id);
    const nextIdx = (idx + delta + this.projects.length) % this.projects.length;
    this.activeProject.set(this.projects[nextIdx]);
  }

  getTechIcon(tech: string): string {
    const map: Record<string, string> = {
      Angular: 'assets/img/angular.png',
      TypeScript: 'assets/img/typescript.png',
      JavaScript: 'assets/img/javascript.png',
      HTML: 'assets/img/html.png',
      CSS: 'assets/img/css.png',
      Firebase: 'assets/img/firebase.png',
    };
    return map[tech] ?? 'assets/img/javascript.png';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.activeProject()) {
      return;
    }
    if (event.key === 'Escape') {
      this.closeProject();
    } else if (event.key === 'ArrowRight') {
      this.stepProject(1);
    } else if (event.key === 'ArrowLeft') {
      this.stepProject(-1);
    }
  }
}
