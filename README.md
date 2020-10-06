# mireco demo

This is the demonstration / development stress test website for Mireco.

## Installation

Install [ruby](https://www.ruby-lang.org/en/documentation/installation/).

So you can install jekyll (required for hosting on Github Pages):

```
gem install jekyll
```

And finally install the javascript dependencies:

```
yarn
```

### Using local development version of Mireco

From the mireco root folder:

```
yarn link
```

Inside the demo folder:

```
yarn link mireco
yarn
```

## Development

From the Mireco root folder, build and watch the javascript/css changes:

```
yarn watch
```

From the demo folder, watch any javascript/css files and serve the html with:

```
yarn start
```
