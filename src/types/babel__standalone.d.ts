declare module "@babel/standalone" {
    export interface TransformOptions {
      presets?: any[];
      plugins?: any[];
    }
  
    export interface TransformResult {
      code: string | null;
      map?: object | null;
    }
  
    export function transform(
      code: string,
      options?: TransformOptions
    ): TransformResult;
  }
  