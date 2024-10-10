# vitepress-transform

[![npm version](https://img.shields.io/npm/v/vitepress-transform?color=pink)](https://npmjs.com/package/vitepress-transform)
[![npm downloads](https://img.shields.io/npm/dm/vitepress-transform?color=pink)](https://npmjs.com/package/vitepress-transform)

Transform markdown in-place before vitepress builds.

## Installation

```sh
# ✨ Auto-detect
npx nypm install vitepress-transform

# npm
npm install vitepress-transform

# yarn
yarn add vitepress-transform

# pnpm
pnpm install vitepress-transform

# bun
bun install vitepress-transform
```

## Usage

In your `.vitepress/config.mts`:

```ts twoslash
import { defineConfig } from "vitepress";
import Transformer from "vitepress-transform";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      ...Transformer((text, id) => {
        return text.replaceAll("<find>", "<replace>");
      }),
    ],
  },
});
```

Or for more manual control:

> [!WARNING]
> 1. Make sure `transformerPlugin` is at the very first of your `vite.plugins` array.
> 2. You **need to** make sure `id` starts with `.md` to avoid conflicts with other files from VitePress.

```ts twoslash
import { defineConfig } from "vitepress";
import { transformerPlugin, movePlugin } from "vitepress-transform";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      transformerPlugin((text, id) => {
        if (id.endsWith(".md")) {
          return text.replaceAll("<find>", "<replace>");
        }
        // REQUIRED: return the original text for all other files
        return text;
      }),
      {
        name: "custom:adjust-order",
        configResolved(c) {
          movePlugin(
            c.plugins as any,
            "custom:transform-content",
            "before",
            "vitepress",
          );
        },
      }
    ],
  },
});
```

## API

### `transformerPlugin`

A vite plugin that transforms markdown in-place before the build.

- `transform` - The function to transform the markdown.
  - `text` - The markdown text.
  - `id` - The file path.

Must return the transformed markdown text or the original text if no transformation is needed.

### `movePlugin`

Move a plugin to a different position in vite's plugin array.

- `plugins` - The array of plugins.
- `pluginAName` - The name of the plugin to move.
- `order` - The order to move the plugin to.
- `pluginBName` - The name of the plugin to move after.

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

Published under the [MIT](https://github.com/taskylizard/vitepress-transform/blob/main/LICENSE) license.
