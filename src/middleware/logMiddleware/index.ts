import {Middleware} from 'redux';
import {Action} from '../../types';

export default (): Middleware => {
  return () => (next: Function) => (action: Action) => { // tslint:disable-line:typedef
    if (!__TEST__) {
      console.log( // tslint:disable-line:no-console
        `%c[%cdispatching%c] %c${action.meta.actionId}%c %c[%c${action.type}%c]`,
        'color: #444;',
        'color: #888;',
        'color: #444;',
        'color: #888;',
        'color: #444;',
        'color: #372;',
        'color: #392;',
        'color: #372;',
        action.payload
      );
    }
    let result = next(action);
    // log result?
    return result;
  };
};
