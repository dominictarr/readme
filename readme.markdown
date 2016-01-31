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
> readme          # for the current module.

> readme optimist # for a locally installed module

> readme readme -g # for a globally installed module.

> readme -c http   # for a core module

> readme readme --web # open the project's webpage

> readme readme --gh # open the projects github page
```

## Shell completions

`readme` comes with completions for the Fish shell (completions for other shells welcome).

To install completions, put `completions/readme.fish` file to a directory listed in `$fish_complete_path`.

```
$ curl -L https://raw.github.com/dominictarr/readme/master/completions/readme.fish >~/.config/fish/completions/readme.fish
```

## License

[BSD](http://opensource.org/licenses/BSD-2-Clause)
