import * as React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from '../../containers/App';
import IndexPage from '../../containers/IndexPage';
import ComboGamePage from '../../containers/ComboGamePage';
import NoteDistanceGamePage from '../../containers/NoteDistanceGamePage';
import NoteNameGamePage from '../../containers/NoteNameGamePage';
import PianoGamePage from '../../containers/PianoGamePage';

/**
 * Creates the React Router routes for the entire app.
 */
export default function createRoutes(): JSX.Element {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={IndexPage}/>
      <Route path="/combo-game" component={ComboGamePage}/>
      <Route path="/note-distance-game" component={NoteDistanceGamePage}/>
      <Route path="/note-name-game" component={NoteNameGamePage}/>
      <Route path="/piano-game" component={PianoGamePage}/>
    </Route>
  );
}
