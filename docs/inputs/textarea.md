# Mireco.Textarea

Auto sizing multi-line text input.

## Props

Form function:

| Prop | Argument | Default | Description |
| ---- | -------- | ------- | ----------- |
| value | `string|undefined` | `undefined` | Current text value. |
| onChange | `function(string)` | `undefined` | Callback when value changes. |
| name | `string` | `undefined` | HTML form `name` value to render to the DOM. |
| required | `boolean` | `false` | Whether or not this field is flagged as required for the DOM. |
| placeholder | `string` | `''` | Placeholder text to show when empty. |
| disabled | `boolean` | `false` | Whether or not this field can be selected / entered into. |
| autoFocus | `boolean` | `false` | Take user focus on mount. |
| tabIndex | `number` | `undefined` | DOM tab index. |
| maxLength | `number` | `undefined` | Maximum length of allowed string. |

Customisation:

| Prop | Argument | Default | Description |
| ---- | -------- | ------- | ----------- |
| block | `boolean` | `false` | Whether this input should be block or inline. |
| className | `string` | `''` | List of additional class names to add to the top-level component. |
| style | `object` | `{}` | Additional inline styles to add to the top-level component. |

Miscellaneous event handlers:

| Prop | Argument | Default | Description |
| ---- | -------- | ------- | ----------- |
| onFocus | `function()` | `undefined` | Callback on focus. |
| onBlur | `function()` | `undefined` | Callback on blur. |
| onKeyDown | `function(event)` | `undefined` | Callback when key is pressed down. |
| onKeyUp | `function(event)` | `undefined` | Callback when key is released. |

## Functions

| Function | Arguments | Description |
| -------- | --------- | ----------- |
| focus | | Call focus to the input |

## Vanilla Mireco additional style classes

| Class | Description |
| ----- | ----------- |
|  |  |
