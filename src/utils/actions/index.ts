/**
 * Typed Redux action implementation taken from Github user @Cooke
 * at https://github.com/reactjs/redux/issues/992#issuecomment-213898898
 * The primary benefit is that our reducers have type safety with the actions they handle.
 * It isn't perfect but it has an acceptable set of tradeoffs.
 * The strangest part is that defining an action means creating a class that is never instantiated.
 * Not everything about this implementation is type safe, however.
 * For example the `actionFactory` function can return properties that exist on the `actionClass`.
 *
 * Example:
 *
 *    // Define an action
 *    export class FooAction {
 *      static type = 'foo';
 *      payload: {bar: string};
 *    }
 *    const foo = createAction(FooAction, (bar: string) => ({payload: {bar}}));
 *
 *    // Usage
 *    dispatch(foo('barStr'));
 */

export interface ActionClass<TAction extends Action> {
  type: string;
  new(): TAction;
}

export interface Action {
  type?: string;
  payload?: any;
}

export function createAction<TAction extends Action, TFactory extends (...args: any[]) => TAction>(
  actionClass: ActionClass<TAction>,
  actionFactory: TFactory
): TFactory {
  return ((...args: any[]): any => {
    const action = actionFactory(...args);
    action.type = actionClass.type;
    return action;
  }) as any;
}

export function isAction<TAction extends Action>(
  action: Action,
  actionClass: ActionClass<TAction>
): action is TAction {
  return action.type === actionClass.type;
}
