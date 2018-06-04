# Child Development Kit

This module is solely meant to be used to help develop child modules for the [Canvas Conversion Tool](https://github.com/byuitechops/d2l-to-canvas-conversion-tool). It provides the necessary commands and tools to run child modules for testing purposes without having to run the entire tool (which would take an eon).

## Commands

Installation:
```
npm install --save byuitechops/child-development-kit
```

To use the CDK, go to your `package.json` and change the `scripts` property to look like this:

```
"scripts": {
    "start": "node ./node_modules/child-development-kit/runChild.js",
    "test": "tap ./node_modules/child-development-kit/runChild.js -T"
}
```

Add a new property named `childType` with either `preImport` or `postImport` as it's value. This determines how the CDK runs the child module.

In order to be able to run your child module, you will need to first run this command:

```
npm start update
```

It will prompt you for a D2L admin username and password. It will download a copy of the current, up-to-date D2L Conversion Gauntlet.

This allows you to use the following commands:

Run the child module:

```
npm start
```

Run the child module and it's associated tests:

```
npm test
```

If the `childType` is set to `preImport`, the CDK will run your childmodule on the downloaded gauntlet export.

If the `childType` is set to `postImport`, a copy of the current Canvas Pristine Gauntlet will be made, and then your child module will run on it.