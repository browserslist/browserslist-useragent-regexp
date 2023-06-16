# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.1.0](https://github.com/browserslist/browserslist-useragent-regexp/compare/v4.0.0...v4.1.0) (2023-06-16)


### Features

* allow all browserslist options via JS API ([#1489](https://github.com/browserslist/browserslist-useragent-regexp/issues/1489)) ([38d1e23](https://github.com/browserslist/browserslist-useragent-regexp/commit/38d1e23fe8e59875208426f9a32b9a4d06577e28))

## [4.0.0](https://github.com/browserslist/browserslist-useragent-regexp/compare/v4.0.0-beta.1...v4.0.0) (2022-11-15)

## [4.0.0-beta.1](https://github.com/browserslist/browserslist-useragent-regexp/compare/v4.0.0-beta.0...v4.0.0-beta.1) (2022-11-06)

## [4.0.0-beta.0](https://github.com/browserslist/browserslist-useragent-regexp/compare/v3.0.0...v4.0.0-beta.0) (2022-10-15)


### ⚠ BREAKING CHANGES

* regexp -> regex in JS API naming, new regexes from ua-regexes-lite
* now browserslist is peer dependency
* NodeJS >= 14 is required, no commonjs support

### Features

* `bluare` binary alias ([288b473](https://github.com/browserslist/browserslist-useragent-regexp/commit/288b4732490977e7e70038b72d94476d735214da))
* browserslist as peer dependency ([eedbcc5](https://github.com/browserslist/browserslist-useragent-regexp/commit/eedbcc58794cb8cbf491027ffd651abadd27d5ed))
* move to ESM ([#1450](https://github.com/browserslist/browserslist-useragent-regexp/issues/1450)) ([41456bc](https://github.com/browserslist/browserslist-useragent-regexp/commit/41456bc22b789fee57384a00abb64e0690ded08a))


### Bug Fixes

* typo in cli option ([e11f219](https://github.com/browserslist/browserslist-useragent-regexp/commit/e11f2196b5b291f31f81057fa5d468c51f48e1a6))


* rename js api, ua-regexes-lite instead of useragents ([#1454](https://github.com/browserslist/browserslist-useragent-regexp/issues/1454)) ([332b7d8](https://github.com/browserslist/browserslist-useragent-regexp/commit/332b7d87cc83e749109f973671239eddcd026bff))

## [3.0.0] - 2021-02-03
### Breaking
- Requires `Node 12+`

## [2.1.1] - 2020-10-17
### Fixed
- [#472](https://github.com/browserslist/browserslist-useragent-regexp/issues/472)

## [2.1.0] - 2020-06-11
### Fixed
- Extracting browser family from regexp fix.

### Changed
- `HeadlessChrome` regexp was removed, works with regular Chrome regexp.

## [2.0.5] - 2020-05-12
### Fixed
- [#434](https://github.com/browserslist/browserslist-useragent-regexp/issues/434)

## [2.0.4] - 2020-04-23
### Fixed
- Desktop Safari regexp.

## [2.0.3] - 2020-04-22
### Fixed
- [#420](https://github.com/browserslist/browserslist-useragent-regexp/issues/420)

## [2.0.2] - 2020-04-16
### Fixed
- [#409](https://github.com/browserslist/browserslist-useragent-regexp/issues/409)

## [2.0.0] - 2020-01-25
### Breaking
- Requires `Node 10+`

## [1.3.1-beta] - 2019-07-30
### Changed
- Dependencies update.

## [1.3.0-beta] - 2019-06-09
### Added
- `trigen-scripts` dev tool.

### Changed
- Dependencies update.

## [1.2.0-beta] - 2019-05-09
### Fixed
- [#23](https://github.com/browserslist/browserslist-useragent-regexp/issues/23): Patch Chrome regexp to ignore Edge useragent.

## [1.1.1-beta] - 2019-05-08
### Fixed
- [#11](https://github.com/browserslist/browserslist-useragent-regexp/issues/11): `rollup-plugin-shebang` -> `rollup-plugin-add-shebang`

## [1.1.0-beta] - 2019-05-01
### Summary
The size of RegExp for `defaults` has decreased by ~63%.
### Changed
- Result RegExps optimizations;
- Removing of useless RegExps from result.

## [1.0.3-beta] - 2019-04-07
### Fixed
- [#11](https://github.com/browserslist/browserslist-useragent-regexp/issues/11)
