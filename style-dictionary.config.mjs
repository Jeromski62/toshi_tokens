import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

const BRANDS = ['brandA', 'brandB'];
const MODES = ['light', 'dark'];

// Always-active sets regardless of brand/mode — see tokens/$themes.json
// ("Global Dimension", "Screen Large", "Consumption Layer" groups).
const BASE_SOURCES = [
  'tokens/scaling/factors.json',
  'tokens/breakpoint/lg/*.json',
  'tokens/alias/*.json',
];

// Only alias tokens are the public API (see harness/AGENTS.md, Hard Rule #2).
// Brand/mode files stay in the source dictionary purely so alias references
// resolve — they are filtered out of the generated CSS output.
const aliasOnly = (token) => token.path[0] === 'alias';

function platformFor(brand, mode) {
  return {
    transformGroup: 'tokens-studio',
    buildPath: 'projects/components/src/lib/tokens/',
    // CSS `font` shorthand can't carry letter-spacing, so typography
    // composites are expanded into separate custom properties instead of
    // being composed into one lossy shorthand value.
    expand: { include: ['typography'] },
    files: [
      {
        destination: `${brand}-${mode}.css`,
        format: 'css/variables',
        filter: aliasOnly,
        options: {
          outputReferences: false,
          selector: `:root[data-brand="${brand}"][data-mode="${mode}"]`,
        },
      },
    ],
  };
}

for (const brand of BRANDS) {
  for (const mode of MODES) {
    const platform = `${brand}-${mode}`;
    const sd = new StyleDictionary({
      source: [
        ...BASE_SOURCES,
        `tokens/brand/${brand}/*.json`,
        `tokens/mode/${mode}.json`,
      ],
      platforms: {
        [platform]: platformFor(brand, mode),
      },
    });
    await sd.hasInitializedPromise;
    await sd.buildPlatform(platform);
  }
}
