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

Build and watch the javascript/css changes:

```
yarn watch
```

Serve the jekyll page (if you are using `yarn link` you cannot have `watch` enabled with `jekyll`
due to a circular loop following symlinks):

```
jekyll serve --no-watch
```
