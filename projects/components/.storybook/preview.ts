import type { Preview } from '@storybook/angular'
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
// Token CSS itself is wired in via angular.json's storybook/build-storybook
// "styles" option (see harness convention: Angular's own style bundling
// handles plain CSS; a raw webpack import here has no loader configured).
setCompodocJson(docJson);

// Default theme for local Storybook viewing — run `npm run tokens:build`
// first so these data attributes have matching CSS custom properties.
document.documentElement.dataset['brand'] = 'brandA';
document.documentElement.dataset['mode'] = 'light';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;