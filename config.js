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
			element: document.querySelector('main h2'),
			property: 'font-size' 
		}
	},
	{
		element: '.box-fontx2',
		property: "height",
		unit: 'px',
		yValues: 2,
		xDefinition: {
			element: document.querySelector('.point75'),
			property: 'font-size' 
		}
	}
])
