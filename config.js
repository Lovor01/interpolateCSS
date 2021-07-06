interpolateCSS([
	{
		element: 'main h2',
		property: "font-size",
		unit: 'px',
		yValues: [18, 14, 26],
    	xBreakpoints: [460, 1024, 1680],
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
		yValues: 0.75,
		xDefinition: {
			element: 'main h2',
			property: 'font-size' 
		}
	}
])
