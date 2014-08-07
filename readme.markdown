# readme

Retrieve a node module's readme from the command line, and pipe it into `less`.

## Installation

``` 
> npm install readme -g
```

## Usage

Show the readme for a node module.

readme resolves your module in the same way as `require()`

```
> readme optimist # for a locally installed module

> readme ./       # for the current module.

> readme readme -g # for a globally installed module.

> readme readme --web # open the project's webpage

> readme readme --gh # open the projects github page
```

## License

[BSD](http://opensource.org/licenses/BSD-2-Clause)
