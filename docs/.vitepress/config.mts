import { defineConfig } from 'vitepress';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import Transformer from '../../src';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitepress Transform',
  description: 'Transform markdown before vitepress builds',
  cleanUrls: true,
  base: '/vitepress-transform/',
  vite: {
    plugins: [
      ...Transformer((text, id) => {
        return text.replaceAll('Hello', 'Hi');
      })
    ]
  },
  markdown: {
    codeTransformers: [transformerTwoslash()]
  }
});
