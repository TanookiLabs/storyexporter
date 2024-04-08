storyexporter
=================

quick n’ dirty CLI tool to copy your pivotal tracker data to an sqlite database. unlike the csv export built into pivotal tracker, this tool brings in comments and file attachments.


```
# visit https://www.pivotaltracker.com/profile and 'create new token'
PIVOTAL_TRACKER_API_KEY="<your-api-key>" npx storyexporter dump --project 2648115 -o my-project.db
```


# Usage

<!-- usage -->
```sh-session
$ npm install -g @tanooki/storyexporter
$ storyexporter COMMAND
running command...
$ storyexporter (--version)
@tanooki/storyexporter/0.4.29 darwin-arm64 node-v20.5.0
$ storyexporter --help [COMMAND]
USAGE
  $ storyexporter COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`storyexporter configure`](#storyexporter-configure)
* [`storyexporter dump`](#storyexporter-dump)
* [`storyexporter help [COMMAND]`](#storyexporter-help-command)

## `storyexporter configure`

saves configuration to ~/.config/storyexporter/config.json

```
USAGE
  $ storyexporter configure --apiKey <value>

FLAGS
  --apiKey=<value>  (required) API key

DESCRIPTION
  saves configuration to ~/.config/storyexporter/config.json

EXAMPLES
  $ storyexporter configure
```

_See code: [src/commands/configure.ts](https://github.com/tanookilabs/storyexporter/blob/v0.4.29/src/commands/configure.ts)_

## `storyexporter dump`

exports pivotal tracker data to sqlite database

```
USAGE
  $ storyexporter dump -o <value> -p <value>

FLAGS
  -o, --database=<value>  (required) path to sqlite database file, e.g. output.db
  -p, --project=<value>   (required) project id to dump

DESCRIPTION
  exports pivotal tracker data to sqlite database

EXAMPLES
  $ storyexporter dump
```

_See code: [src/commands/dump.ts](https://github.com/tanookilabs/storyexporter/blob/v0.4.29/src/commands/dump.ts)_

## `storyexporter help [COMMAND]`

Display help for storyexporter.

```
USAGE
  $ storyexporter help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for storyexporter.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.20/src/commands/help.ts)_
<!-- commandsstop -->
