# Ear Sharpener

[__Ear Sharpener__](https://ryanatkn.github.io/ear-sharpener) is a simple game for practicing pitch perception.
While [ear training](https://en.wikipedia.org/wiki/Ear_training) probably won't give
you [absolute or perfect pitch](https://en.wikipedia.org/wiki/Absolute_pitch), it may improve
your [relative pitch](https://en.wikipedia.org/wiki/Relative_pitch).
[__Try it__](https://ryanatkn.github.io/ear-sharpener) for yourself!

[https://ryanatkn.github.io/ear-sharpener](https://ryanatkn.github.io/ear-sharpener)

## Tech notes
- Made with TypeScript, React, Redux, Immutable.js, React Router, PostCSS, Mocha, Chai, Sinon, Enzyme, Webpack, and the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension).
- All non-container React components are pure and implement a shallow compare for `shouldComponentUpdate`, made possible by Redux and immutable app state.
- There's a lot of complexity in the `gameActions` to get the desired UX. The four main sources of complexity include time-sequenced actions and side effects, disabling input when appropriate, canceling async audio that should no longer be played due to user input, and sequencing actions in the combo game differently than in standalone games. Overall it feels like there is some significant friction between Redux and the needs of this game.
- Imperfect TypeScript integration:
    - Redux actions are type safe in reducers but the implementation comes with some tradeoffs - see `src/utils/actions/index.ts` for more.
    - lots of awkwardness around Immutable.js records - uses [these overrides](https://github.com/facebook/immutable-js/issues/341#issuecomment-147940378) to get more type safety, but type safety isn't possible when setting values
    - the game components have to specify all default props to allow the ToggleableGame component to use them generically
- There's some awkwardness at the boundary between Immutable.js and plain JS objects/arrays. The app state is represented fully with Immutable.js data structures and primitives, but many supporting model functions use plain JS arrays/objects because Immutable.js collections are unwieldy.
- The idea of the UI being a pure projection of state is somewhat at odds with event-triggered time-dependent effects like the feedback animations after guesses. This lead to some strange workarounds like tracking action counters in the game state that get used in React component keys to get the desired animations.
- The Redux actions and reducers are tested together, not in isolation. This is not ideal for all applications but this game has nontrivial thunk action creators that are coupled with the store state and time-sequenced side effects. Testing these would require hacks to manipulate the store state (or coupling with reducers or models) and some complex mocks, so I decided to just test the entire action/reducer flow. An alternate side effects model like redux-saga could make testing the actions and reducers separately more viable.

## Possible future enhancements
- more sounds than just piano, like other instruments and generated synths
- expose game variables in the ui so the player can configure things to their liking
- let the player lock the current difficulty level
- more game types? variations of existing games?
- ...? [share](https://github.com/ryanatkn/ear-sharpener/issues) your ideas!

## Develop
Requires Node (tested with v5/6).

    npm install
    npm install -g tsd
    tsd install
    npm test
    npm start
    # browse to http://localhost:8080

## Piano audio samples

Uploaded by user [beskhu](https://www.freesound.org/people/beskhu/)
at [freesound.org](https://www.freesound.org/search/?q=piano&f=grouping_pack%3A%2217088_Upright+piano+multisamples%22&s=score+desc&advanced=0&g=1).
(public domain license) Transformed with Audacity into 3 second mp3s that fade out.

## License
MIT
