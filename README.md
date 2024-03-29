# mireco

[![npm version](https://badge.fury.io/js/mireco.svg)](http://badge.fury.io/js/mireco)
![Downloads](http://img.shields.io/npm/dm/mireco.svg?style=flat)

Mireco is an extensible library for user interfaces with no heavy dependencies (especially css).

>_"The golden teaspoon of date pickers"_
>
>\- Luke Hodkinson

Looking for a Mireco interface but styled to your favourite web theme? Check out our styled
wrappers:

- [Bootstrap Mireco][1]

Check out the [live demo page here][2].

Above all else, Mireco aims to be the best interface for dealing with input components. All
components adhere to the following guidelines:

## React Interface Philosophy

- All input props take the form of a singular `value` and `onChange`
- All components are stateless where practical, following the
  [Tri-State Value System](#tri-state-values)
- Input's `onChange` is a function callback with the new `value` as an argument (consumers do no
  direct reading from dom elements with refs)
- The `onChange` callback and `value` prop both use the same `value` format, which is always a
  primitive or predefined shape of primitives
- For basic use cases, all inputs are expected to be used by Mireco consumers as flat components -
  eg. the `Checkbox` component uses a convenience `label="label contents"` prop instead of requiring
  `<Label><Checkbox/> label contents</Label>`

Non battle-tested guidelines:

- Existing html properties such as `style` and `className` should be passed through - with prefixes
  where there are multiple injection points eg. `containerStyle` and `inputStyle`
- The `style` prop refers to the outermost container of a Mireco component. More specific style
  overrides are given with explicit references eg. `inputStyle` and `labelStyle`. Where these
  overlap and refer to the same element as the `style` prop, they are merged with the more specific
  name taking precedent.

## HTML Design Philosophy

All Mireco components should be designed with the following in mind:

- No external static file requirements - all images are inline `svg` so they support css styling,
  only use native fonts
- Adhere to strict html components where reasonable for accessibilty
- Minimal html element hierarchy eg. no enormous chains of `<div>`
- Everything should still be usable _without any css_
- Inputs should still render a basic `html` `form` value
- All components should work by default on any platform (mobile, desktop)
- All css selectors are namespaced to avoid clashes
- Use native browser focus, and support keyboard navigation with js events
- All size units are in `rem` (except for `em` for `line-height`s relative to `font-size`)
- Like normal html form inputs, all form components are rendered as `inline` or `inline-block` by
  default. For convenience, the Mireco api provides a block version of all inputs by passing a
  `block` prop
- No media queries are used in scaling inputs - they should size to their container and not the
  screen, using `flex-basis` to take up multiple rows when necessary
- There is no hard coded minimum width for any input

## Installation

Install the package from npm:

```
npm install mireco
```

Make sure your html document is encoded properly (required by `parse-duration` micro symbol):

```
<html>
  <head>
    <meta charset="utf-8">
  </head>
</html>
```

Add the stylesheets:

```
<link rel="stylesheet" href="node_modules/mireco/dist/mireco-layout.css" />
<link rel="stylesheet" href="node_modules/mireco/dist/mireco-theme.css" />
```

To support inputs that have modal dropdowns, ensure that the body of your document (and any
absolutely positioned content blocks such as modals) all have a padding of at least `15rem` at the
bottom.

## Development Setup

### Environment Install

For convenience install [mise][3] to manage your environment.

When it's installed setup `mise` with:

```
mise install
```

This will install the required versions of `node` and `ruby`.

### Project Install

To install the project dependencies:

```
bundle
npm install
( cd demo && npm install )
```

This will install the `gems` (for demo site hosting) and `node_modules` (for package building).

### Building Mireco

With the environment and project installation complete, you can build `mireco` with:

```
npm run build
```

Or more likely for development convenience, you'll want to watch for changes with:

```
npm run watch
```

### Building the Demo

With `mireco` built, you can build the demo site (using your local copy of `mireco`) with:

```
( cd demo && npm run build )
```

Or again for convenience, you will want to both watch for changes and host the site with:

```
( cd demo && npm run start )
```

This will use `jekyll` to host the demo site [on your computer](http://127.0.0.1:4001).

## Components

Check out the [API Documentation][4].

Basic form inputs:

- [ ] Abstract Duration (understands months, years)
- [x] Button
- [x] CalendarMonth
- [x] Date
- [x] Duration
- [x] Month
- [x] Select
- [x] Text
- [x] Time

Compound form inputs:

- [ ] DateRange
- [x] Datetime
- [x] DatetimeRange

Layout:

- [ ] Label
- [ ] Modal

## Tri-State Values

Having properly bound components in React is tricky when the components that the user needs to
interact with are required to sometimes be in invalid states.

The best example of this is a date selector with a text input component - if a user is typing in a
value of `31/3/2012`, between each keystroke the value when parsed could either be completely
different (`31/3` would resolve to the current year) or invalid (`31` would be of the current month
which does not necessarily contain 31 days).

Most packages get around this with a variety of strategies that have their own drawbacks:

- Requiring some kind of "commitment" action to the value, for instance typing only highlights a day
  on a calendar and the user must click the day to select it (clunky to use and does not report
  new values to higher components early enough to integrate well)
- Completely detaching the state from its value prop (so the parent cannot change the value whilst
  the user is interacting with the widget)

All Mireco components should instead follow this flow of value update:

- The component _always_ updates its parent when any part of it is changed:
  - A value of `undefined` means that a `true value` cannot in any way be understood from the
    `various state contents`
  - A value of `null` means that the value is explicitly set to nothing
  - A `true value` (of whatever data type is appropriate for your input, eg. milliseconds integer)
    is reported when the value can be parsed with the most generous rules possible (does not have to
    be perfect)
- When a Mireco component receives a new `prop value`, it is compared to the current `various state
  contents`. If it has changed:
  - If the `prop value` is set to `undefined`, do absolutely nothing
  - If the `prop value` is set to a `true value` or `null`:
    - If this is different from the current parsed `various state contents`:
      - Update the `various state contents` to a perfectly formatted representation of the new
        `prop value`, as this means the parent has explicitly overridden our value
    - Otherwise, do nothing as this update was likely initiated by this component itself
- When a Mireco component is blurred:
  - If the `prop value` is set to a `true value`:
    - Set the `various state contents` to a perfectly formatted representation of the `prop value`
  - Otherwise:
    - Reset the `various state contents` to defaults

Following this flow, self-initiated updates of value are non destructive to the current state whilst
still allowing the parent to change its value. Also, as `undefined` and `null` are often
interchangeable you can simply take the given `value` `onChange` without any validation or workflow
in Mireco consumers.

[1]: https://github.com/bor3ham/bootstrap-mireco/
[2]: https://bor3ham.github.io/mireco/
[3]: https://github.com/jdx/mise
[4]: /docs/api.md
