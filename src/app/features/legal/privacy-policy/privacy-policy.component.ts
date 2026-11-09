import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-privacy-policy',
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

        <h1>{{ 'PRIVACY_POLICY' | translate }}</h1>

        <h2>{{ 'RESPONSIBLE' | translate }}</h2>
        <p>{{ 'RESPONSIBLE_TEXT' | translate }}</p>

        <h2>{{ 'DATA_COLLECTION' | translate }}</h2>
        <h3>{{ 'DATA_COLLECTION_WEBSITE_TITLE' | translate }}</h3>
        <p>{{ 'DATA_COLLECTION_WEBSITE_TEXT' | translate }}</p>
        <ul>
          <li>{{ 'IP_ADDRESS' | translate }}</li>
          <li>{{ 'ACCESS_TIME' | translate }}</li>
          <li>{{ 'FILE_NAME_URL' | translate }}</li>
          <li>{{ 'REFERRER_URL' | translate }}</li>
          <li>{{ 'BROWSER_OS_PROVIDER' | translate }}</li>
        </ul>
        <p>{{ 'DATA_COLLECTION_PURPOSES' | translate }}</p>
        <ul>
          <li>{{ 'PURPOSE_LIST_1' | translate }}</li>
          <li>{{ 'PURPOSE_LIST_2' | translate }}</li>
          <li>{{ 'PURPOSE_LIST_3' | translate }}</li>
          <li>{{ 'PURPOSE_LIST_4' | translate }}</li>
        </ul>
        <p>{{ 'LEGAL_BASE' | translate }}</p>

        <h3>{{ 'CONTACT_FORM_TITLE' | translate }}</h3>
        <p>{{ 'CONTACT_FORM_TEXT' | translate }}</p>
        <ul>
          <li>{{ 'CONTACT_FORM_NAME' | translate }}</li>
          <li>{{ 'CONTACT_FORM_EMAIL' | translate }}</li>
          <li>{{ 'CONTACT_FORM_MESSAGE' | translate }}</li>
        </ul>
        <p>{{ 'CONTACT_FORM_PROCESSING' | translate }}</p>
        <p>{{ 'CONTACT_FORM_USAGE' | translate }}</p>

        <h2>{{ 'DATA_STORAGE_DELETION' | translate }}</h2>
        <p>{{ 'DATA_STORAGE_DELETION_TEXT' | translate }}</p>

        <h2>{{ 'DATA_SHARING' | translate }}</h2>
        <p>{{ 'DATA_SHARING_TEXT' | translate }}</p>
        <ul>
          <li>{{ 'DATA_SHARING_LIST_1' | translate }}</li>
          <li>{{ 'DATA_SHARING_LIST_2' | translate }}</li>
          <li>{{ 'DATA_SHARING_LIST_3' | translate }}</li>
          <li>{{ 'DATA_SHARING_LIST_4' | translate }}</li>
        </ul>

        <h2>{{ 'YOUR_RIGHTS' | translate }}</h2>
        <p>{{ 'YOUR_RIGHTS_TEXT' | translate }}</p>
        <ul>
          <li>{{ 'YOUR_RIGHTS_LIST_1' | translate }}</li>
          <li>{{ 'YOUR_RIGHTS_LIST_2' | translate }}</li>
          <li>{{ 'YOUR_RIGHTS_LIST_3' | translate }}</li>
          <li>{{ 'YOUR_RIGHTS_LIST_4' | translate }}</li>
          <li>{{ 'YOUR_RIGHTS_LIST_5' | translate }}</li>
          <li>{{ 'YOUR_RIGHTS_LIST_6' | translate }}</li>
        </ul>

        <h2>{{ 'RIGHT_TO_WITHDRAW' | translate }}</h2>
        <p>{{ 'RIGHT_TO_WITHDRAW_TEXT' | translate }}</p>

        <h2>{{ 'CHANGES_TO_POLICY' | translate }}</h2>
        <p>{{ 'CHANGES_TO_POLICY_TEXT' | translate }}</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {
  private readonly smoothScroll = inject(SmoothScrollService);

  constructor() {
    afterNextRender(() => {
      this.smoothScroll.scrollToTop(true);
    });
  }
}

