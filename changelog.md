# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## v1.3.3
### Added
- fix that repeated calls to interpolateCSS do not issue again setting resize

## v1.3.3
### Added
- Refresh method of interpolateCSS as a possibility to rescan and set again all interpolating elements

## v1.2.0
### Added
- xDefinition element can also be selected with selector string (jQuery - like selector)

## v1.1.0
### Added
- selection on multiple elements, multiple elements can depend on one xDefinition, interpolateCSSDone fires only once upon finish, not on every element
