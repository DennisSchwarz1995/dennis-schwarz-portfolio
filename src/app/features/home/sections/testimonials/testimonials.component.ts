import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PORTFOLIO_TESTIMONIALS } from '../../../../core/data/portfolio.data';
import { ScrollRevealDirective } from '../../../../core/directives/scroll-reveal.directive';
import { TranslatePipe } from '../../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TranslatePipe, ScrollRevealDirective],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  readonly testimonials = PORTFOLIO_TESTIMONIALS;

  getInitials(author: string): string {
    return author
      .split(' ')
      .map((part) => part.replace('.', '').charAt(0))
      .join('')
      .toUpperCase();
  }
}

