import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

/**
 * Base Button — Primary variant.
 *
 * Wraps PrimeNG's unstyled `pButton` directive for behavior (label/disabled
 * handling, focus and ARIA plumbing) and styles it entirely through Toshi
 * alias tokens — see button.component.css.
 */
@Component({
  selector: 'toshi-button',
  standalone: true,
  imports: [ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      pButton
      type="button"
      class="toshi-button toshi-button--primary"
      [label]="label"
      [disabled]="disabled"
    ></button>
  `,
  styleUrl: './button.component.css',
})
export class ToshiButtonComponent {
  @Input() label = '';
  @Input() disabled = false;
}
