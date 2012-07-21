# readme

retrive a node modules readme from the command line, and pipe it into `less`.

## Installation

``` 
> npm install readme -g
```

## Usage

show the readme for a node module.

readme resolves your module in the same way as `require()`

```
> readme optimist # for a locally installed module

> readme ./       # for a the current module.

> reame readme -g # for a globally installed module.
```

## Licence

BSD
