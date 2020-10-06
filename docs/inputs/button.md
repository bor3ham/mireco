# Mireco.Button

Standard HTML form button.

## Props

Form function:

| Prop | Argument | Default | Description |
| ---- | -------- | ------- | ----------- |
| onClick | `function()` | `undefined` | Callback when button is pressed. |
| type | `'button', 'submit'` | `'button'` | Type of button. |
| name | `string` | `undefined` | HTML form `name` to render to the DOM for type `submit`. |
| value | `string` | `undefined` | HTML form `value` to render to the DOM for type `submit`. |
| disabled | `boolean` | `false` | Whether or not the button can be focused / pressed. |
| autoFocus | `boolean` | `false` | Take user focus on mount. |
| tabIndex | `number` | `undefined` | DOM tab index. |

Customisation:

| Prop | Argument | Default | Description |
| ---- | -------- | ------- | ----------- |
| children | `node` | `false` | Contents of button |
| block | `boolean` | `false` | Whether this input should be block or inline. |
| className | `string` | `undefined` | List of additional class names to add to the top-level component, following the [classnames input format][1]. |
| style | `object` | `undefined` | Additional inline styles to add to the top-level component, following [React's inline styles format][2]. |

Miscellaneous event handlers:

| Prop | Argument | Default | Description |
| ---- | -------- | ------- | ----------- |
|  |  |  |  |

## Functions

| Function | Arguments | Description |
| -------- | --------- | ----------- |
|  |  |  |

## Vanilla Mireco additional style classes

| Class | Description |
| ----- | ----------- |
| secondary | Changes the colour from primary to secondary. |
| content | Changes the colour from primary to the same as page content. |
| outline | Swaps the appearance from fill to outline. |

[1]: https://www.npmjs.com/package/classnames#usage
[2]: https://reactjs.org/docs/dom-elements.html#style
