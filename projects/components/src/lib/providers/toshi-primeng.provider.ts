import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { providePrimeNG } from 'primeng/config';

/**
 * theme: 'none' is the v18 mechanism for disabling PrimeNG's built-in design
 * tokens and component CSS (Aura/Lara/Nora presets). With it unset, every
 * visual property must come from Toshi alias tokens via pt (pass-through)
 * bindings instead of a PrimeNG theme.
 */
export function provideToshiPrimeNG(): EnvironmentProviders {
  return makeEnvironmentProviders([providePrimeNG({ theme: 'none' })]);
}
