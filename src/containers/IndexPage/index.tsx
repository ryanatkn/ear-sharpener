import * as React from 'react';
import Link from '../../components/Link';

// tslint:disable:max-line-length

export default class IndexPage extends React.Component<{}, {}> {
  render(): JSX.Element {
    return (
      <div className="page text-block">
        <p>
          Ear Sharpener is a simple game for practicing pitch perception.
          While <a href="https://en.wikipedia.org/wiki/Ear_training">ear training</a> probably won't give
          you <a href="https://en.wikipedia.org/wiki/Absolute_pitch">absolute or perfect pitch</a>, it may improve
          your <a href="https://en.wikipedia.org/wiki/Relative_pitch">relative pitch</a>.
          Choose a game above and see for yourself!
          The <Link to="/piano-game">Piano Game</Link> is the easiest one to start with.
        </p>
        <p>
          <strong>Please note:</strong> the piano sounds are
          <a href="https://github.com/ryanatkn/ear-sharpener/issues/2">a little off pitch</a>.
          You probably shouldn't play it too long.
        </p>
        <p>
          Source code is available <a href="https://github.com/ryanatkn/ear-sharpener">here on Github.</a> This
          website is made with TypeScript, React, Redux, Immutable.js, React Router, PostCSS, Mocha, Chai,
          Sinon, Enzyme, Webpack, and the Redux DevTools Extension.
        </p>
        <p>
          If you have any suggestions for the game or the
          code <a href="https://github.com/ryanatkn/ear-sharpener/issues">please share them</a>!
          You can also email me at mail at ryanatkn.com.
        </p>
      </div>
    );
  }
}
