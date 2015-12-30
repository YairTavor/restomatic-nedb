# restomatic-nedb
[Restomatic](https://github.com/YairTavor/restomatic) DB adapter for
[NeDB](https://github.com/louischatriot/nedb).

> **NOTE!** This is a project in development, and should not be used until
> stable. I will remove this note when the project is stable enough to
> use.

## Install

`npm install --save restomatic-nedb-adapter`

## How to use

When using restomatic, you will need to require the NeDB adapter like this:

```javascript
    var restomatic = require('restomatic'),
        // set NeDB as your restomatic db
        db = require('restomatic-nedb-adapter')(restomatic);

    // configure the path of the db files (optional)
    db.options.dbFolder = 'path/to/db/folder';

    // fire up restomatic
    restomatic.start();
```

That's it. You are good to go.