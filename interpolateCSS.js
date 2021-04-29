/*
 * Interpolate library
 * Copyright 2021
 * Author: Lovro Hrust
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * accepts array of config objects through interpolateCSS initializing function
 * fires interpolateCSSDone event when all interpolations are finished
 * raises warning if some elements in config objects are not valid or do not exist
 *
 * version 1.0.0
 *
 *
 * accepts config object with following properties:
 * DOMel : selector string or DOM element
 * prop : property being changed
 * unit : unit for the property being changed
 * xBreakPoints: breakpoints for x between which to interpolate
 * yValues : y values for the same breakpoints
 * xDefinition : object with properties
 * 	{element, property}
 * extrapolateMin : extrapolate lower than smallest breakpoint. If this is not set, property value is fixed on lowest y value for lower values of x
 * extrapolateMax : extrapolate lower than highest breakpoint. If this is not set, property value is fixed on greatest y value for greater values of x
 * minYValue, maxYValue not yet applied
 */
'use strict';
function interpolateCSS(config) {

	const evDone = new Event('interpolateCSSDone');
	//
	// check for emptyness, and if object is DOM object
	config.forEach(function(curel, index) {

		function giveWarning() {
			console.warn('Provided element number ' + index + ' is not DOM element, interpolation will not work on element! \nElement: ' + curel.DOMel )
		}

		if (typeof curel.DOMel === 'string') {
			let tempEl = document.querySelectorAll(curel.DOMel);
			tempEl.forEach(function(el){
				if (! (el instanceof Element)) {
					giveWarning();
					el = undefined;
				}
			})
			const NodeListLength = tempEl.length;
			if (NodeListLength === 0) {
				giveWarning();
				curel.DOMel = undefined;
			} else {
				// set element accordingly if string represents more elements or one
				if ( NodeListLength === 1 )
					curel.DOMel = tempEl[0]
				else
					curel.DOMel = tempEl;
			}
		} else
			if (! curel.DOMel || ! (curel.DOMel instanceof Element) ) {
				giveWarning();
				curel.DOMel = undefined;
			};
		if (curel && curel.xDefinition)
			if (! curel.xDefinition.element instanceof Element) {
				console.warn('Provided xDefinition element in element number ' + index + ' is not DOM element, interpolation will not work on element! \nElement: ' + curel.DOMel )
				curel.DOMel = undefined;
			}
	});

	//  remove empty elements
	config = config.filter(function(el) {
		return Boolean(el.DOMel);
	})


	/* TODO: add check if xBreakPoints array is sorted */

	//  if empty, there is nothing to do
	if (config.length === 0)
		return;

	// set interpolation on resize and run initially
	window.addEventListener('resize', doInterps);
	// if doMutations is requested, set observing DOM mutations
	if (config.doMutations) {
		const observer = new MutationObserver(doInterps);
		observer.observe(document.querySelector('body'));
	}
	doInterps();


	function doInterps() {
		// just set requestAnimationFrame to throttle event handler
		window.requestAnimationFrame(function() {

			function setCSSProp(DOMel, property, callback) {
				if (DOMel instanceof NodeList)
					DOMel.forEach(function(el) { callback(el, property) });
				else
					callback(DOMel, property);
			}

			function linearInterpolation(el, index, x) {
				// this is extracted in order to extend for other types of interpolation
				function linearFormula(aDOMel, property) {
					// aDOMel is passed as parameter, the rest variables are from outer scope
					aDOMel.style[property] = ((el.yValues[index + 1] - el.yValues[index])/(el.xBreakPoints[index + 1] - el.xBreakPoints[index]) * (x - el.xBreakPoints[index]) + el.yValues[index]) + el.unit;
				}
				if (el.hasOwnProperty('DOMElementPercentage')) {
					el.DOMel.style[el.prop] = (((el.DOMElementPercentage[index+1] - el.DOMElementPercentage[index]) / (el.xBreakPoints[index + 1] - el.xBreakPoints[index]) * (x - el.xBreakPoints[index]) + el.DOMElementPercentage[index]) / 100 * (el.DOMElementProperty === 'height' ? el.DOMElementRelated.offsetHeight : el.DOMElementRelated.offsetWidth))  + 'px';
					return;
				}
				setCSSProp(el.DOMel, el.prop, linearFormula)
				didInterpolate = true;
			}

			function separateValueAndUnit(inValue) {
				let numeric = parseInt(inValue);
				return [numeric, inValue.substring(numeric.toString().length)]
			}

			// outer scope variables to be accessible everywhere
			let didInterpolate;

			// configEl is array element of config, array of objects
			// main loop iterating all settings
			config.forEach(function(configEl) {
				// extract this function so it is not inline
				function outsideBoundaries(DOMel, property) {
					if (configEl.minYValue || configEl.maxYValue) {
						DOMel.style[property] = x < el.xBreakPoints[0] ? minYValue : maxYValue
					}
					else {
						DOMel.style[property] = ''
					}
				}

				let x;
				if (configEl.hasOwnProperty('xDefinition')) {
					let rArray = separateValueAndUnit(
						window.getComputedStyle(configEl.xDefinition.element)[configEl.xDefinition.property]
					);
					x = rArray[0];
					if (! configEl.hasOwnProperty('unit'))
						configEl.unit = rArray[1];
				}
				else
					// if xDefinition is not set, window width is the x
					x = window.innerWidth;


					// if breakpoints are not defined just calculate relation
				if (! configEl.hasOwnProperty('xBreakpoints')) {
					setCSSProp(configEl.DOMel, configEl.prop,
						function(DOMel, property) { DOMel.style[property] = configEl.yValues * x + configEl.unit })
				}
				// else interpolate
				else {
					const xBreakpointsLengthChk = configEl.xBreakPoints.length - 1;
					didInterpolate = false;

					for (let index = 0; index < xBreakpointsLengthChk; index++) {

						if ((x >= configEl.xBreakPoints[index] && x <= configEl.xBreakPoints[index + 1]) ||
						(configEl.extrapolateMin && index == 0 && x < configEl.xBreakPoints[index]))
						{
							linearInterpolation(configEl, index, x);
							break;
						}
					}
					if (configEl.extrapolateMax && x > configEl.xBreakPoints[xBreakpointsLengthChk])
					{
							linearInterpolation(configEl, xBreakpointsLengthChk - 1, x);
					}
					if (! didInterpolate)
						setCSSProp(configEl.DOMel, configEl.prop,
							function(DOMel, property) { DOMel.style[property] = '' })
				}

				window.dispatchEvent(evDone);
			});
		});
	}
}

