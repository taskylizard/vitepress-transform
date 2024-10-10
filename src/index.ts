import type { Plugin } from 'vitepress';

export type TransformFunction = (text: string, id: string) => string;

/**
 * A vite plugin that transforms markdown in-place before the build.
 * @param transform - The function to transform the markdown
 */
export function transformerPlugin(transform: TransformFunction): Plugin {
  return {
    name: 'custom:transform-content',
    enforce: 'pre',
    transform(code, id) {
      return transform(code, id);
    }
  };
}

/**
 * Move a plugin to a different position in vite's plugin array
 * @param plugins - The array of plugins
 * @param pluginAName - The name of the plugin to move
 * @param order - The order to move the plugin to
 * @param pluginBName - The name of the plugin to move after
 */
export function movePlugin(
  plugins: { name: string }[],
  pluginAName: string,
  order: 'before' | 'after',
  pluginBName: string
) {
  const pluginBIndex = plugins.findIndex((p) => p.name === pluginBName);
  if (pluginBIndex === -1) return;

  const pluginAIndex = plugins.findIndex((p) => p.name === pluginAName);
  if (pluginAIndex === -1) return;

  if (order === 'before' && pluginAIndex > pluginBIndex) {
    const pluginA = plugins.splice(pluginAIndex, 1)[0];
    plugins.splice(pluginBIndex, 0, pluginA);
  }

  if (order === 'after' && pluginAIndex < pluginBIndex) {
    const pluginA = plugins.splice(pluginAIndex, 1)[0];
    plugins.splice(pluginBIndex, 0, pluginA);
  }
}

export default (transforms: TransformFunction) =>
  [
    transformerPlugin((text, id) => {
      if (id.startsWith('.md')) {
        return transforms(text, id);
      }
      return text;
    }),
    {
      name: 'custom:adjust-order',
      configResolved(c) {
        movePlugin(
          c.plugins as any,
          'custom:transform-content',
          'before',
          'vitepress'
        );
      }
    }
  ] satisfies Plugin[];
