<h1 align="center">Apollo GraphQL tutorial rewrite using JavaScript 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

Forked from [VeeDrive repo](https://github.com/agavitalis/VeeDrive) used by this [tutorial](https://github.com/agavitalis/VeeDrive), which is a JavaScript rewrite of [Apollo tutorial](https://www.apollographql.com/docs/tutorial/introduction)

## File structure

The app is split out into two folders:
- `start`: Starting point for the tutorial
- `final`: Final version

From within the `start` and `final` directories, there are two folders (one for `server` and one for `client`).

## Enhancements done in this repo

Here I worked in `final` (`start` was left intact from [VeeDrive repo](https://github.com/agavitalis/VeeDrive)). The modifications are:

* Authentication by email and password
* API SpaceX updated to v3
* Launch date included in launch details
* Loading component doesn't cover Header component
* Detection and cleaning of invalid login token stored in localStorage
* Sqlite initiallization so there is no need to include an initial sqlite file

### ✨ <a href="https://apollo-react-aqa7s7uoga-uc.a.run.app" target="_blank">Demo</a>
### ✨ <a href="https://apollo-server-aqa7s7uoga-uc.a.run.app" target="_blank">GraphQL server</a>

## Installation

To run the app, run these commands in two separate terminal windows from the root:

```bash
cd final/server && npm i && npm start
```

and

```bash
cd final/client && npm i && npm start
```