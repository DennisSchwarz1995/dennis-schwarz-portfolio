import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TooltipDirective } from '../../../../core/directives/tooltip.directive';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';
import { SmoothScrollService } from '../../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslatePipe, TooltipDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly smoothScroll = inject(SmoothScrollService);

  scrollTo(sectionId: string): void {
    void this.smoothScroll.navigateToSection(sectionId);
  }
}
