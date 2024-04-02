oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g storyexporter
$ storyexporter COMMAND
running command...
$ storyexporter (--version)
storyexporter/0.4.27 darwin-arm64 node-v16.15.1
$ storyexporter --help [COMMAND]
USAGE
  $ storyexporter COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`storyexporter hello PERSON`](#storyexporter-hello-person)
* [`storyexporter hello world`](#storyexporter-hello-world)
* [`storyexporter help [COMMAND]`](#storyexporter-help-command)
* [`storyexporter plugins`](#storyexporter-plugins)
* [`storyexporter plugins:install PLUGIN...`](#storyexporter-pluginsinstall-plugin)
* [`storyexporter plugins:inspect PLUGIN...`](#storyexporter-pluginsinspect-plugin)
* [`storyexporter plugins:install PLUGIN...`](#storyexporter-pluginsinstall-plugin-1)
* [`storyexporter plugins:link PLUGIN`](#storyexporter-pluginslink-plugin)
* [`storyexporter plugins:uninstall PLUGIN...`](#storyexporter-pluginsuninstall-plugin)
* [`storyexporter plugins reset`](#storyexporter-plugins-reset)
* [`storyexporter plugins:uninstall PLUGIN...`](#storyexporter-pluginsuninstall-plugin-1)
* [`storyexporter plugins:uninstall PLUGIN...`](#storyexporter-pluginsuninstall-plugin-2)
* [`storyexporter plugins update`](#storyexporter-plugins-update)

## `storyexporter hello PERSON`

Say hello

```
USAGE
  $ storyexporter hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/tanookilabs/storyexporter/blob/v0.4.27/src/commands/hello/index.ts)_

## `storyexporter hello world`

Say hello world

```
USAGE
  $ storyexporter hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ storyexporter hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/tanookilabs/storyexporter/blob/v0.4.27/src/commands/hello/world.ts)_

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

## `storyexporter plugins`

List installed plugins.

```
USAGE
  $ storyexporter plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ storyexporter plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.10/src/commands/plugins/index.ts)_

## `storyexporter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ storyexporter plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ storyexporter plugins add

EXAMPLES
  $ storyexporter plugins add myplugin 

  $ storyexporter plugins add https://github.com/someuser/someplugin

  $ storyexporter plugins add someuser/someplugin
```

## `storyexporter plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ storyexporter plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ storyexporter plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.10/src/commands/plugins/inspect.ts)_

## `storyexporter plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ storyexporter plugins install PLUGIN...

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ storyexporter plugins add

EXAMPLES
  $ storyexporter plugins install myplugin 

  $ storyexporter plugins install https://github.com/someuser/someplugin

  $ storyexporter plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.10/src/commands/plugins/install.ts)_

## `storyexporter plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ storyexporter plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ storyexporter plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.10/src/commands/plugins/link.ts)_

## `storyexporter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ storyexporter plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ storyexporter plugins unlink
  $ storyexporter plugins remove

EXAMPLES
  $ storyexporter plugins remove myplugin
```

## `storyexporter plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ storyexporter plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.10/src/commands/plugins/reset.ts)_

## `storyexporter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ storyexporter plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ storyexporter plugins unlink
  $ storyexporter plugins remove

EXAMPLES
  $ storyexporter plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.10/src/commands/plugins/uninstall.ts)_

## `storyexporter plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ storyexporter plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ storyexporter plugins unlink
  $ storyexporter plugins remove

EXAMPLES
  $ storyexporter plugins unlink myplugin
```

## `storyexporter plugins update`

Update installed plugins.

```
USAGE
  $ storyexporter plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.3.10/src/commands/plugins/update.ts)_
<!-- commandsstop -->
