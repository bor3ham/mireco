# mireco

Mireco is an extensible library for user interfaces with no heavy dependencies (especially css)

## Design philosophy

All Mireco components should be designed with the following guidelines:

- No external static file requirements - all images are inline `svg`, only use native fonts
- All components are stateless where possible - eg. an input with a `value` prop will not have a
  `value` state, but may have a `dropdownOpen` state
- Adhere to strict html components where reasonable for accessibilty
- Minimal html element hierarchy eg. no enormous chains of `<div>`
- Everything should still be usable _without any css_
- All input props take the form of a singular `value` and `onChange`
- Input's `onChange` is a function callback with the new `value` as an argument (consumers do no
  direct reading from dom elements with refs)
- Inputs should still render a basic `html` `form` value
- All components should work by default on any platform (mobile, desktop)
- All css selectors are namespaced to avoid clashes
- Use native browser focus, and support keyboard navigation with js events
- All size units are in `rem` (`em` for `line-height`s relative to `font-size` permitted)

Non battle-tested guidelines:

- Existing html properties such as `style` and `className` should be passed through - with prefixes
  where there are multiple injection points eg. `containerStyle` and `inputStyle`
- All inputs are rendered as `inline-block` by default, can be switched to `block` mode to fit
  width (so resizing is done by wrapping in a fixed width container)
- All inputs are expected to be used by Mireco consumers as flat components - eg. the `Checkbox`
  component uses a convenience `label` prop instead of requiring `<Label><Checkbox/> label</Label>`

## Components

Form inputs:

- Button
- Text
- Date
- DateRange
- Datetime
- DatetimeRange
- Month
- CalendarMonth
- Duration
- Select

Layout:

- Label
- Modal
