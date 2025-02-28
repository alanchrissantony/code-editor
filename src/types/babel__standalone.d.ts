declare module '@babel/standalone' {
    export interface TransformOptions {
      presets?: any[];
      plugins?: any[];
      // Add additional Babel options as needed.
    }
  
    export interface TransformResult {
      code: string | null;
      map?: object | null;
    }
  
    export function transform(
      code: string,
      options?: TransformOptions
    ): TransformResult;
  
    // You can add additional exports here if needed, such as:
    // export function transformFromAst(ast: any, code?: string, options?: TransformOptions): TransformResult;
  }
  