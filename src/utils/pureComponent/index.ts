import * as React from 'react';
import shallowCompare = require('react-addons-shallow-compare'); // tslint:disable-line:no-require-imports max-line-length

/**
 * Decorator that mutates a React `Component` by adding a shallow compare `shouldComponentUpdate`.
 */
export default function pureComponent(Component: React.ComponentClass<any>): void {
  Component.prototype.shouldComponentUpdate = shouldComponentUpdate;
}

function shouldComponentUpdate(nextProps: any, nextState: any): boolean {
  return shallowCompare(this, nextProps, nextState); // tslint:disable-line:no-invalid-this
}
