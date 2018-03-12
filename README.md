# Async in MobX

I've always loved MobX because of it's lack of boilerplate in comparison to Redux. It just seems so effortless to modify state... so how does it fare with Async code?

In Redux you'd reach for something like [thunk](https://github.com/gaearon/redux-thunk), but in MobX there are a few easy ways you can deal with asynchronous code.

This tutorial explains how to run Async code in both MobX 3 and MobX 4.

## The Incorrect Way

The funny thing about MobX is that the code below will probably work, but isn't recommended. That's because action functions are the only place you are supposed to modify the state. Here we are modifying it in the function which gets called on successful promise resolution, not in the action itself.

```js
@action
loadWeather = city => {
  fetch(
    `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
  )
    .then(response => response.json())
    .then(data => {
      this.weatherData = data;
    });
};
```

## Avoid the Incorrect Way

**In MobX 4**:

By importing the `configure` function and telling it to enforceActions, you can have MobX throw an error if you happen to modify the state outside of an action.

```js
import { configure } from "mobx";
configure({ enforceActions: true });
```

**In MobX 3**:

By importing the `useStrict` function, you can have MobX throw an error if you happen to modify the state outside of an action.

```js
import { useStrict } from "mobx";
useStrict(true);
```

## An Action Modifies State

Let's correct the code in "The Incorrect Way". We'll move the code that modifies the state into its own function, and make that the action instead of the code which performs the fetch.

```js
// no longer an action
loadWeather = city => {
  fetch(
    `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
  )
    .then(response => response.json())
    .then(data => {
      this.setWeatherData(data);
    });
};

// becomes the action, purely to set the data
@action
setWeatherData = data => {
  this.weatherData = data;
};
```

## Using runInAction

You can turn a callback (or promise resolve function) into an action by using the `runInAction` function.

```js
import { runInAction } from "mobx";

// ...

loadWeatherRunInThen = city => {
  fetch(`https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`)
    .then(response => response.json())
    .then(data => {
      // now we can turn this part of our code into an action
      // this will allow us to modify state
      runInAction(() => {
        this.weatherData = data;
      });
    });
};
```

Here is the same example but using async await instead of `then` callback functions. Async/Await code seems synchronous because it reads in order like synchronous code, but it's really just syntactic sugar over the `then` approach.

```js
loadWeatherRunInAsync = async city => {
  const response = await fetch(
    `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
  );
  const data = await response.json();

  runInAction(() => {
    this.weatherData = data;
  });
};
```

## Async and Generators

As of MobX 4 there is a function called `flow` part of MobX Core, while in MobX 3 there is a function called `asyncAction` in the [mobx-utils](https://www.npmjs.com/package/mobx-utils) package that lets you solve the "async issue" in a slightly different way.

The `*` is important as it denotes the function as a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), whereas [yield](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) gives control to the iterator. We'll pass our generator function to the `flow` (or `asyncAction`) function, and every place there is supposed to be `await` in a typical Async/Await scenario, we'll use the `yield` keyword instead.

```js
import { flow } from "mobx";
// MobX 3
// import {asyncAction} from "mobx-utils"

// ...

loadWeatherGenerator = flow(function*(city) {
  const response = yield fetch(
    `https://abnormal-weather-api.herokuapp.com/cities/search?city=${city}`
  );
  const data = yield response.json();
  this.weatherData = data;
});
```

You'll notice above I didn't use an arrow function... which is because I don't think there is a way to do generator functions with arrow functions, at least in Babel. This should be possible in Typescript.

## A Babel Plugin

If writing `runInAction` code annoys you and brings you back to the thunk/redux boilerplate, try out the [mobx-deep-action](https://github.com/mobxjs/babel-plugin-mobx-deep-action) plugin, which automatically wraps nested functions in action functions. This is part of the mobxjs organization, so it should have pretty good support going forward.

## Conclusion

Visit the [MobX documentation](https://mobx.js.org/best/actions.html#writing-asynchronous-actions) for the ultimate guide to writing async code in MobX. In this article we covered the incorrect way, the `runInAction` approach and the `flow` (or `asyncAction`) with generator function approach.

Alternatively you can use a Babel plugin to automatically wrap Async/Await code in `runInAction` functions for you.
