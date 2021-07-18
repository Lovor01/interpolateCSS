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
		yValues: 2,
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
	}
])
