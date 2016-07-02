# Ear Sharpener

[__Ear Sharpener__](https://ryanatkn.github.io/ear-sharpener) is a
simple game for practicing pitch perception.
While [ear training](https://en.wikipedia.org/wiki/Ear_training) probably won't give
you [absolute or perfect pitch](https://en.wikipedia.org/wiki/Absolute_pitch), it may improve
your [relative pitch](https://en.wikipedia.org/wiki/Relative_pitch).
[__Try it__](https://ryanatkn.github.io/ear-sharpener) for yourself!

[https://ryanatkn.github.io/ear-sharpener](https://ryanatkn.github.io/ear-sharpener)

## Tech notes
- Made with TypeScript, React, Redux, Immutable.js, React Router, PostCSS, Mocha, Chai, Sinon,
  Enzyme, Webpack, and the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension).
- I wrote about my experience with TypeScript on this
  game [here on Reddit](https://www.reddit.com/r/typescript/comments/4oa3gz/a_summary_of_my_experience_working_with/).
- Redux actions are type safe in reducers using the discriminated union types available in TypeScript nightly.
  The actions are defined in [`src/types.ts`](https://github.com/ryanatkn/ear-sharpener/blob/master/src/types.ts).
  The old ununsed hacky action implementation is in
  [`src/utils/actions`](https://github.com/ryanatkn/ear-sharpener/blob/master/src/utils/actions/index.ts).
- Friction between Redux and the needs of this game:
    - There's a lot of complexity in the `gameActions` to get the desired UX.
      The four main sources of complexity include time-sequenced actions and side effects,
      disabling input when appropriate, canceling async audio that should no longer be played due
      to user input, and sequencing actions in the combo game differently than in standalone games.
    - The Redux actions and reducers are tested together, not in isolation.
      This is not the recommended best practice,
      but this game has thunk action creators like `gameActions.guess` and `gameActions.present`
      that sequence multiple dispatched actions and side effects based on changing store state.
      Mocking the store with something like redux-mock-store is possible but impractical
      because these action creators read the state changes to behave correctly,
      so mocking the store would require mocking all state changes after each dispatch,
      which duplicates reducer logic and adds significant complexity.
      Given this dependency of actions on reducers,
      I wrote the action tests to include the entire action/reducer flow,
      and the reducers have simple smoke tests.
    - Redux reducers should be pure,
      so presenting a game (playing its audio) is not performed in reducers.
      However presenting also requires data transformations,
      so the `PresentingAction` and `PresentedAction` create the new states.
      Doing this unfortunately fragments some of the logic.
      For example, it would follow the rest of the app's conventions that `present(game)`
      increments the `presentCount` and plays the audio, but now they are separate code paths.
      This design is more verbose and error prone than it feels like it should be.
- There's a boundary between Immutable.js and plain JS objects/arrays in the models
  before the heavier data transformations.
  The app state is represented fully with Immutable.js data structures,
  but many supporting model functions use plain JS arrays/objects
  because Immutable.js collections are unwieldy.
- The React idea of the UI being a pure projection of state
  is somewhat at odds with event-triggered time-dependent effects
  like the feedback animations after guesses.
  This lead to some strange workarounds like tracking action counters in the game state
  that get used in React component keys to get the desired animations.
- All non-container React components implement a shallow comparefor `shouldComponentUpdate`,
  made possible by Redux and immutable app state.

## Possible future enhancements
- more sounds than just piano, like other instruments and generated synths
- expose game variables in the ui so the player can configure things to their liking
- let the player lock the current difficulty level
- more game types? variations of existing games?
- better support for mobile and keyboard controls
- display audio load failures to the player instead of an unending loading animation
- ...? [share](https://github.com/ryanatkn/ear-sharpener/issues) your ideas!

## Develop

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
