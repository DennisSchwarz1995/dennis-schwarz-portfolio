import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  styleUrl: '../_legal-shared.scss',
  template: `
    <section class="legal-page">
      <div class="legal-page__inner">
        <a routerLink="/" class="legal-page__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ 'BACK_TO_HOME' | translate }}</span>
        </a>

        <h1>{{ 'LEGAL_NOTICE' | translate }}</h1>

        <h2>{{ 'LEGAL_NOTICE_PARAGRAPH' | translate }}</h2>
        <p>
          <strong>Dennis Schwarz</strong><br />
          Zum Bremmenfeld 11<br />
          66539 Neunkirchen (Saar)<br />
          {{ 'COUNTRY' | translate }}
        </p>

        <h2>{{ 'CONTACT' | translate }}</h2>
        <p>
          E-Mail:
          <a href="mailto:kontakt@dennis-schwarz.dev">kontakt&#64;dennis-schwarz.dev</a>
        </p>

        <h2>{{ 'RESPONSIBLE_PARAGRAPH' | translate }}</h2>
        <p>
          Dennis Schwarz<br />
          Zum Bremmenfeld 11<br />
          66539 Neunkirchen (Saar)
        </p>

        <h2>{{ 'LIABILITY_FOR_CONTENT' | translate }}</h2>
        <p>{{ 'LIABILITY_FOR_CONTENT_TEXT_1' | translate }}</p>
        <p>{{ 'LIABILITY_FOR_CONTENT_TEXT_2' | translate }}</p>

        <h2>{{ 'LIABILITY_FOR_LINKS' | translate }}</h2>
        <p>{{ 'LIABILITY_FOR_LINKS_TEXT_1' | translate }}</p>
        <p>{{ 'LIABILITY_FOR_LINKS_TEXT_2' | translate }}</p>

        <h2>{{ 'COPYRIGHT' | translate }}</h2>
        <p>{{ 'COPYRIGHT_TEXT_1' | translate }}</p>
        <p>{{ 'COPYRIGHT_TEXT_2' | translate }}</p>

        <h2>{{ 'PRIVACY_POLICY' | translate }}</h2>
        <p>{{ 'PRIVACY_POLICY_TEXT_1' | translate }}</p>
        <p>{{ 'PRIVACY_POLICY_TEXT_2' | translate }}</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNoticeComponent {
  private readonly smoothScroll = inject(SmoothScrollService);

  constructor() {
    afterNextRender(() => {
      this.smoothScroll.scrollToTop(true);
    });
  }
}

