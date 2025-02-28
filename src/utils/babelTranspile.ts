// @ts-ignore - Babel types are incomplete
import { transform } from '@babel/standalone';

export const transpileReact = (code: string) => {
  try {
    return transform(code, {
      presets: ['react'],

      filename: 'component.jsx'
    } as {
      presets: string[];
      filename?: string;
      ast?: boolean;
      sourceType?: 'script' | 'module';
    }).code;
  } catch (e) {
    console.error('Transpilation error:', e);
    return `console.error(${JSON.stringify(e instanceof Error ? e.message : 'Unknown error')});`;
  }
};