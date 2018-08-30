# mireco

Mireco is an extensible library for user interfaces with no heavy dependencies (especially css).

It intends to be a simple example html implementation of a `React` interface that adheres to the
following guidelines:

## React Interface Philosophy

- All input props take the form of a singular `value` and `onChange`
- All components are stateless where possible, more specifically:
  - The input's `value` is completely bound, meaning it can be updated at any time by the parent and
    the component will reflect these changes
  - Similarly, an input should update its parent with the `onChange` as soon and frequently as
    it can with sensible defaults that aren't destructive when they circle back as a `value` prop
- Input's `onChange` is a function callback with the new `value` as an argument (consumers do no
  direct reading from dom elements with refs)
- All time or duration values are handled internally as `milliseconds from epoch` in `utc`. Any
  localisation should be performed in your own wrapper components.
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
  default. For convenience, the Mireco api provides a block version of all inputs eg.
  `Mireco.block.checkbox` versus `Mireco.checkbox`

## Components

Basic form inputs:

- [x] Button
- [x] Text
- [x] Time
- [x] Date
- [ ] Duration
- [ ] Select
- [ ] Month
- [ ] CalendarMonth

Compound form inputs:

- [x] Datetime
- [ ] DateRange
- [ ] DatetimeRange

Layout:

- [ ] Label
- [ ] Modal
