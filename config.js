interpolateCSS([
	{
		element: 'main > h2',
		property: "font-size",
		unit: 'px',
		yValues: [14, 20, 34],
    	xBreakpoints: [260, 1024, 1680],
	},
	{
		element: '.point75',
		property: "font-size",
		unit: 'px',
		yValues: 0.75,
		xDefinition: {
			element: 'main h2',
			property: 'font-size'
		}
	},
	{
		element: '.box-fontx2',
		property: "height",
		unit: 'px',
		yValues: 3,
		xDefinition: {
			element: '.point75',
			property: 'font-size'
		}
	},
	{
		element: '.aspect',
		property: "height",
		unit: 'px',
		yValues: 0.75,
		xDefinition: {
			element: 'self',
			property: 'width'
		}
	},
	{
		element: '.aspect h3',
		property: "font-size",
		unit: 'rem',
		yValues: [0.8, 1.2],
		xBreakpoints: [768, 1600],
	},
	{
		element: '.aspect1',
		property: "height",
		unit: 'px',
		yValues: 0.25,
		xDefinition: {
			element: 'self',
			property: 'width'
		}
	},
	{
		element: '.circle',
		property: "height",
		unit: 'px',
		yValues: 1,
		xDefinition: {
			element: 'self',
			property: 'width'
		}
	},
	{
		element: '.circle h3',
		property: "font-size",
		unit: 'rem',
		yValues: [1.2, 1.2, 0.8, 1.2],
		xBreakpoints: [300, 767, 768, 1600],
	},
	{
		element: '#paranormal-float',
		property: "bottom",
		unit: 'px',
		yValues: [0, 0, window.innerHeight - 1],
		xBreakpoints: [300, 768, 1600],
		extrapolateMax: true

	},
	{
		element: '#paranormal-float',
		property: "left",
		unit: 'px',
		yValues: [0, 0, 912],
		xBreakpoints: [300, 768, 1600],
		extrapolateMax: true
	}
])
