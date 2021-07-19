# interpolateCSS - a solution for fluid web design
This library does not use dependencies.

## Why?
Some fluid design necessities like changing font size depending on window width are (still) cumbersome to achieve with plain CSS, while other things are impossible, like changing one property related to changes in other properties. This library aims to mitigate those problems. See **[Demo](https://lovor01.github.io/interpolateCSS/)**

## What?
Interpolation of CSS property from one value to another in relation to change of another CSS property (including window width and height and properties of the same element)

## Which?
Which problems are solved by using this library? To name a few:
- font scaling dependent on screen width or height, or other elements width or height or even other properties like font size of another element
- simple solution to fixed aspect ratio of HTML Element
- responsive circle or ellipse or ellipsoid elements are very easy to create
- establishing automatic (set and forget) relation of CSS property of one element to property of other element or even another property of same element
- linear interpolation of property between given values for breakpoint values of related property (i.e. if font size 16px is given for window width of 768px and font size 24px is given for window width of 2500px, library will automatically adjust font sizes for all window widths between. It could even extrapolate and multiple breakpoints could be given)

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
Explanation: this configuration call sets up automatic resize of width of first element in config from 180 to 220 depending on screen width from 768 to 1680. Interpolation works also after screen width of 1680 pixels, while below of 768 width is not set (width is in that case defined by CSS). For second element, height is calculated from its width, multiplied by 0.68. In effect this achieves constant aspect ratio.

From this example we see that, it is easy to achieve:
1. interpolating CSS property from one value to another
2. maintaining constant aspect ratio

However, possibilities are greater than just for those two examples.

## Config object syntax:
(?? means optional - xDefinition?? means xDefinition property in config object is optional)

- **element**: DOM element(s) or string selector with the same syntax as in [Document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
- **property**: property of element above to change
- **unit**: unit of property to change, like e.g. "px"
- **xBreakpoints**??: array of breakpoints between which property is interpolated, array must be sorted
- **yValues**: array of values which are boundary values of property at points defined by xBreakpoints. It must be sorted in same order as xBreakpoints It can also be single number if xBreakpoints are not defined, in that case, property specified by xDefinition is multiplied by that number
- **xDefinition**??: object which defines element and property that is observed for change and serves as source for calculating property above
  {
  - **element**: source element, it can also be special keyword *''self''*, which means the same element from above definition, same syntax as above element property
  - **property**: source property
  }
  If not specified, default is *width* property of *window*.
- **extrapolateMin**: extrapolate property above greatest breakpoint
- **extrapolateMax**: extrapolate property below smallest breakpoint

## Is it performant?
Yes, library is small and it uses *resize* event of `window` together with `window.requestAnimationFrame` to achieve speed. Some necessary calculations are done once when initializing library and saved in memory for optimal performance. Observers are in plan for future release.

## Compatibility
Modern browsers (Chrome, Firefox, Edge...). Library does not work in IE.