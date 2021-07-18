/*
 * InterpolateCSS library
 * Copyright 2021
 * Author: Lovro Hrust
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * intended to solve dynamic change of CSS properties, interpolation and relational changes,
 * when one element property changes, change the other accordingly
 *
 * accepts array of config objects through interpolateCSS initializing function
 * fires interpolateCSSDone event when all interpolations are finished
 * raises warning if some elements in config objects are not valid or do not exist
 *
 * version 1.3.0
 *
 *
 * accepts config object with following properties:
 * element : selector string or DOM element (multiple elements allowed)
 * property : property being changed, could be given as css-style (line-height) or Javascript style (lineHeight)
 * unit : unit for the property being changed
 * xBreakpoints: array of breakpoints for x between which to interpolate, currently must be sorted from smallest to biggest
 * yValues : array of y values for the same breakpoints
 * xDefinition : object with properties
 * 	{element, property}
 * extrapolateMin : extrapolate lower than smallest breakpoint. If this is not set or false, property value is fixed on lowest y value for lower values of x
 * extrapolateMax : extrapolate higher than highest breakpoint. If this is not set or false, property value is fixed on greatest y value for greater values of x
 * minYValue, maxYValue not yet applied
 *
 * interpolateCSSDone event is dispatched when interpolation is finished
 *
 * improved from v1.1.0 - selection on multiple elements, multiple elements can depend on one xDefinition, interpolateCSSDone fires only once upon finish, not on every element
 */
'use strict';
function interpolateCSS(config) {


	const evDone = new Event('interpolateCSSDone');

	// validation part, correct things like changing css property style into Javascript style (camelCase without dash)
	// check for emptyness, and if object is DOM object
	config.forEach(function(curel, index) {

		function giveWarning(el) {
			console.warn('Provided element in object number ' + index + ' is not valid DOM element, or query does not give all valid elements, interpolation will not work on element! \nElement: ' + el )
		}

		/* function correctCSSpropToCamelCase() {
			let dashPos = curel.property.indexOf('-');
			if (dashPos !== -1)
				curel.property = curel.property.substring(0, dashPos-1) + curel.property.substring(dashPos+1, dashPos+2).toUpperCase() + curel.property.substring(dashPos+2);
		} */

		// if yValue is object it has to have at least multiply property
		function validConfigYValues() {
			function isValidSingle(el) {
				return (typeof el === 'number') || (typeof el === 'object' && el.hasOwnProperty('multiply'));
			}
			if (curel.singleY)
				return isValidSingle(curel.yValues);
			else
			{
				let valid = true;
				curel.yValues.forEach(function(el) { valid = valid && isValidSingle(el) });
				return valid;
			}
		}

		function stringToDOM(selector) {
			// consider revising so that selector is only variable (no tempEl) for greater speed
			let tempEl;
			if (typeof selector === 'string') {
				tempEl = document.querySelectorAll(selector);
				tempEl.forEach(function(el) {
					if (! (el instanceof Element)) {
						giveWarning();
						el = undefined;
					}
				})
				// check if returned NodeList has zero length
				const NodeListLength = tempEl.length;
				if (NodeListLength === 0) {
					giveWarning();
					tempEl = undefined;
				} else {
					// set element accordingly if string represents more elements or one
					if ( NodeListLength === 1 )
						// single element
						tempEl = tempEl[0];
				}
			} else
				if (! selector || ! (selector instanceof Element) ) {
					giveWarning();
					tempEl = undefined;
				} else
					tempEl = selector;

			return tempEl;
		}

		// mark if yValues is array - do not check typeof many times, query variable

		curel.singleY = ! Array.isArray(curel.yValues);
		if (! validConfigYValues()) {
			console.error('Given yValues is misconfigured; not number nor Array or property multiply does not exists! Stopping.');
			return;
		}

		// if element is string, find DOM element(s)
		curel.element = stringToDOM(curel.element);

		if (curel && curel.xDefinition) {
			if (curel.xDefinition.element === 'self')
				curel.xDefinition.element = (curel.element instanceof NodeList) ? curel.element[0] : curel.element;
			else
				curel.xDefinition.element = stringToDOM(curel.xDefinition.element);

		}

		// if there is only single y, spread to all breakpoints
		if (curel.singleY && curel.xBreakpoints)
			curel.yValues = curel.xBreakpoints.map(function() {return curel.yValues} )


	});

	//  remove empty elements
	config = config.filter(function(el) {
		return Boolean(el.element);
	})
	// end of validation
	// *****************


	/* TODO: add check if xBreakpoints array is sorted */

	//  if empty, there is nothing to do
	if (config.length === 0)
		return;

	// set interpolation on resize and run initially
	window.addEventListener('resize', doInterpolations);


	interpolateCSS.doInterpolations = doInterpolations;

	doInterpolations();

	/**
	 * Callback that does calculations and interpolation
	 */
	function doInterpolations() {
		// set requestAnimationFrame to throttle event handler
		window.requestAnimationFrame(function() {

			function setCSSProp(element, property, callback) {
				if (element instanceof NodeList)
					element.forEach(function(el) { callback(el, property) });
				else
					callback(element, property);
			}


			/**
			 * subfunction to interpolate and write css style
			 * @param  {DOM element} el element, with one or more values for y between to interpolate
			 * @param  {integer} index index of breakpoints between which it is interpolated
			 * @param  {float} x
			 */
			function linearInterpolation(el, index, x) {
				// this is extracted in order to extend for other types of interpolation
				function linearFormula(aDOMel, property) {
					// aDOMel is passed as parameter, the rest variables are from outer scope
					aDOMel.style[property] = ((el.yValues_calc[index + 1] - el.yValues_calc[index])/(el.xBreakpoints[index + 1] - el.xBreakpoints[index]) * (x - el.xBreakpoints[index]) + el.yValues_calc[index]) + el.unit;
				}

				setCSSProp(el.element, el.property, linearFormula)
				didInterpolate = true;
			}

			function separateValueAndUnit(inValue) {
				let numeric = parseFloat(inValue);
				return { value: numeric, unit: inValue.substring(numeric.toString().length)}
			}

			// outer scope variables to be accessible everywhere
			let didInterpolate;

			// configEl is array element of config, array of objects
			// main loop iterating all settings
			config.forEach(function(configEl) {

				// x is compared with breakpoints
				// rArray is object of value and unit - a structure. Unit is string
				let x = null, rArray;
				// prepare yValues function

				// check if xDefinition exists and prepare variables accordingly
				// this means that y is calculated from x, otherwise it is simple value
				if (configEl.hasOwnProperty('xDefinition')) {
					let getCalculatedY;
					if (typeof configEl.yValues === 'object' )
						// function to facilitate calculation of y if it is object of multiply, add
						getCalculatedY = function(x, y) { return x * y.multiply + y.add; };
					else
						getCalculatedY = function(x, y) { return x * y }
					// rArray is array of value [0] and unit [1]
					rArray = separateValueAndUnit(
						window.getComputedStyle(configEl.xDefinition.element)[configEl.xDefinition.property]
					);
					// calculate y, yValues_calc spreads yValues on all Breakpoints
					if (configEl.singleY)
						configEl.yValues_calc = getCalculatedY(rArray.value, configEl.yValues);
					else
						configEl.yValues_calc =  configEl.yValues.map(function(el){
							return getCalculatedY(rArray.value, el);
						});
					// unit is not obligatory, if not defined it takes unit from xDefinition object
					if (! configEl.hasOwnProperty('unit'))
						configEl.unit = rArray.unit;
					if (! configEl.xDefinition.breakPointsFromElement)
						x = window.innerWidth;
				}
				else {
					// no xDefinition, things are simpler
					configEl.yValues_calc = configEl.yValues;
					rArray = {value: window.innerWidth, unit: 'px'}
				};

				if (! x)
					x = rArray.value;



					// if breakpoints are not defined just calculate relation
				if (! configEl.hasOwnProperty('xBreakpoints')) {
					setCSSProp(configEl.element, configEl.property,
						function(element, property) { element.style[property] = configEl.yValues_calc + configEl.unit })
				}
				// else interpolate
				else {
					const xBreakpointsLengthChk = configEl.xBreakpoints.length - 1;
					didInterpolate = false;

					for (let index = 0; index < xBreakpointsLengthChk; index++) {

						if ((x >= configEl.xBreakpoints[index] && x <= configEl.xBreakpoints[index + 1]) ||
						(configEl.extrapolateMin && index == 0 && x < configEl.xBreakpoints[index]))
						{
							linearInterpolation(configEl, index, rArray.value);
							break;
						}
					}
					if (configEl.extrapolateMax && x > configEl.xBreakpoints[xBreakpointsLengthChk])
					{
							linearInterpolation(configEl, xBreakpointsLengthChk - 1, x);
					}
					if (! didInterpolate)
						setCSSProp(configEl.element, configEl.property,
							function(element, property) { element.style[property] = '' })
				}
			});
			window.dispatchEvent(evDone);

		});
	}
}