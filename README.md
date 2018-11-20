# Child Development Kit (CDK)

This module is solely meant to be used to help develop child modules for the [Canvas Conversion Tool](https://github.com/byuitechops/d2l-to-canvas-conversion-tool). It provides the necessary commands and tools to run child modules for testing purposes without having to run the entire tool (which would take an eon). Essentially it's a mini conversion tool that runs only your child module so you can see how it runs without the overhead of installing, understanding, maintaining, and running the full conversion tool.

## Installation
```
npm i --save-dev byuitechops/child-development-kit
```

## Setup
The [child-template](https://github.com/byuitechops/child-template) repo is a boilerplate for child modules and is already set up to work with the CDK. Minor adjustments are still required.

### Package.json
The CDK relies heavily on properties in your `package.json` file. To use the CDK, go to your `package.json` and change the `scripts` property to look like this:

```js
"scripts": {
    "start": "node ./node_modules/child-development-kit/runChild.js",
    "inspect": "node --inspect-brk ./node_modules/child-development-kit/runChild.js -T"
    "test": "tap ./node_modules/child-development-kit/runChild.js -T"
}
```

Add a new property named `childType` with either `preImport` or `postImport` as it's value. This determines how the CDK runs the child module. **If you used the child-template boilerplate the default value for this property is `preImport`**.


In order to be able to run your child module, you will need to first run this command:

```
npm start update
```

It will prompt you for a D2L admin username and password. It will download a copy of the current, up-to-date D2L Conversion Gauntlet.


## Usage

Once the CDK is set up you can use the following commands:

- Run your child module:

```
npm start [gauntlet number]
```

- Run the child module and it's associated tests:

```
npm test [gauntlet number]
```

Gauntlet number is optional (the default is 1). 99.9% of the time you shouldn't change the gauntlet number. For an explanation of the various gauntlet courses look [here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool#testing)


If the `childType` is set to `preImport`, the CDK will run your child module on the downloaded gauntlet export. At this point you'll need to look in the `./node_modules/child-development-kit/factory/processed` directory to see if the changes were correctly applied to the course files.

If the `childType` is set to `postImport`, a copy of the current Canvas Pristine Gauntlet will be made, and then your child module will run on it. The CDK will provide a link to the course it created which you can access to verify the child module ran as expected.