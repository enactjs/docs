---
sidebar_label: 'Button'
sidebar_position: 1
---
# sandstone/Button

Sandstone styled button components and behaviors.

```jsx
<Button>Hello Enact!</Button>
```

<h3 style={{borderBottom: 'none'}}>Members</h3>

### Button <span>Component</span>

A button component, ready to use in Sandstone applications.

Usage:

```jsx
import {Button} from '@enact/sandstone/Button';

<Button
	backgroundOpacity="transparent"
	size="small"
	icon="home"
>
	Press me!
</Button>
```

Extends: [sandstone/Button.ButtonBase](#buttonbase-component)  
Wrapped with: [sandstone/Button.ButtonDecorator](#buttondecorator-component)

### ButtonBase <span>Component</span>

A button component.

This component is most often not used directly but may be composed within another component as it is within [Button](#button-component).

```jsx
import {ButtonBase} from '@enact/sandstone/Button';
```

Extends: ui/Button.ButtonBase

# <div className="props">Properties</div>

|                                                                                                                          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [backgroundOpacity](#button#button-component.backgroundopacity)<br/> <span className="prop">'opaque''transparent'</span> | The background opacity of this button.<br/> Text buttons and icon+text buttons, by default are opaque, while icon-only buttons default to transparent. This value can be overridden by setting this prop.<br/> Valid values are: `'opaque'`, and `'transparent'`.<br/> Default: 'opaque'                                                                                                                                                                          |
|                    [color](#button#button-component.color)<br/> <span className="prop">'red''green''yellow''blue'</span> | The color of the underline beneath button's content.<br/> Accepts one of the following color names, which correspond with the colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`.                                                                                                                                                                                                                                             |
|                                            [css](#button#button-component.css)<br/> <span className="prop">Object</span> | Customizes the component by mapping the supplied collection of CSS class names to the corresponding internal elements and states of this component.<br/> The following classes are supported:<br/><ul><li>`button` - The root class name</li><li>`bg` - The background node of the button</li><li>`large` - Applied to a `size='large'` button</li><li>`selected` - Applied to a `selected` button</li><li>`small` - Applied to a `size='small'` button</li></ul> |

### ButtonDecorator <span>Component</span>

Applies Sandstone specific behaviors to [Button](#button-component) components.

```jsx
import {ButtonDecorator} from '@enact/sandstone/Button';
```

Includes: sandstone/TooltipDecorator.TooltipDecorator  
Includes: sandstone/Marquee.MarqueeDecorator  
Includes: ui/Button.ButtonDecorator  
Includes: spotlight/Spottable.Spottable  
Includes: sandstone/Skinnable.Skinnable
