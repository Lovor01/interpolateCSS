# interpolateCSS - a tiny library with no dependencies

## Why?
Some fluid design neccessities like changing font size depending on window width are (still) cumbersome to achieve with plain CSS, while other things are impossible, like changing one property related to changes in other properties. This library aims to mitigate those problems.

## What?
Interpolation of CSS property from one value to another in relation to change of another CSS property (including window width and height and properties of the same element)

## How?
Library is initialized through call to interpolateCSS initializer, passing the config object which defines which properties of which elements are to be changed and depending on what:
```javascript
interpolateCSS([
	{
		element: '.wp-block-makeiteasy-about-us .circle-div',
		property: "width",
		unit: 'px',
		yValues: [180, 220],
		xBreakpoints: [768, 1680],
		extrapolateMax: true
	},
	{
		element: '.mie-thumb-image-container .wp-block-embed iframe',
		property: "height",
		unit: 'px',
		yValues: 0.68,
		xDefinition: {
			element: 'self',
			property: 'width'
		},
	},
]);
```

## Config object syntax:
(?? means optional)

**element**: DOM element or string selector with the same syntax as in [Document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)  
**property**: property of element above to change  
**unit**: unit of property to change, like e.g. "px"  
**xBreakpoints**??: array of breakpoints between which property is interpolated, array must be sorted  
**yValues**: array of values which are boundary values of property at points defined by xBreakpoints. It must be sorted in same order as xBreakpoints It can also be single number if xBreakpoints are not defined, in that case, property specified by xDefinition is multiplied by that number  
**xDefinition**??: object which defines element and property that is observed for change and serves as source for calculating property above  
  {  
  **element**: source element, it can also be special keyword ''self'', which means the same element from above definition  
  **property**: source property   
  }  
**extrapolateMin**: extrapolate property above greatest breakpoint  
**extrapolateMax**: extrapolate property below smallest breakpoint  

## Is it performant?
Yes, library is small and it uses requestAnimationFrame and observers to achieve speed. Some necessary calculations are done once when initializing library and saved in memory for optimal performance
