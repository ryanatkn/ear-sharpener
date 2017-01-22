/* tslint:disable:no-reference */
///<reference path='../node_modules/immutable/dist/immutable.d.ts'/>
/* tslint:enable:no-reference */

/* tslint:disable:no-internal-module no-unused-variable no-namespace */

type nodeEnv = 'production' | 'development' | 'test';
interface Process {
  env: {
    NODE_ENV: nodeEnv;
  };
}
declare var process: Process;

declare var __DEV__: boolean;
declare var __PROD__: boolean;
declare var __TEST__: boolean;

interface Window {
  devToolsExtension?: () => Redux.Middleware;
}

interface Dict<T> {
  [key: string]: T;
}

/**
 * Immutable.js Record overrides
 * Type overrides taken from
 * https://github.com/facebook/immutable-js/issues/341#issuecomment-147940378
 */
declare module Immutable {
  export module Record {
    type IRecord<T> = T & TypedMap<T>;

    interface TypedMap<T> extends Map<string, any> {
      set(key: string, value: any): TypedMap<T>;
    }

    interface Factory<T> {
      new (): IRecord<T>;
      new (values: T): IRecord<T>;

      (): IRecord<T>;
      (values: T): IRecord<T>;
    }
  }

  export function Record<T>(
    defaultValues: T, name?: string
  ): Record.Factory<T>;
}

declare module 'redux-localstorage' {
  const reduxLocalstorage: any;
  export = reduxLocalstorage;
}
