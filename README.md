# api-resource-migrator
Easy API resource migration process: 


## Simple configuration 
### Migrate objects from one API to another.

```
// Require and create migrator
const migrator = require('api-resource-migrator')();

// Create migrations objects
const migration = {
  source: {
    url: "http://origin.com/resource/",
    headers: {
      "content-type": "application/json"
    }
  },
  target: {
    url: "http://target.com/resource/",
    headers: {
      "content-type": "application/json"
    }
  },
  ids: [
    "Resource-1",
    "Resource-2",
    "Resource-3",
    "Resource-4"
  ]
}

// Add all your migration objects to the queue
migrator.add(migration);

// Run all migrations!
migrator.run();
```

## Advanced configuration

### Limit parallelism level

```
// This will copy 5 resources in parallel
migrator.run(5);
```

### Set custom HTTP Headers

```
const migration = {
  source: {
    url: "http://origin.com/resource/",
    headers: {
      "content-type": "application/json",
      "accept-version":"3.0.0",
      "X-My-Header": "This is a custom header field"
      
    }
  },
  target: {
    url: "http://target.com/resource/",
    headers: {
      "content-type": "application/json",
      "authorization":"my-secret-token",
      "User-Agent": "MyUseragent/1.0"
    }
  },
  ids: [
    "Resource-1",
    "Resource-2",
    "Resource-3",
    "Resource-4"
  ]
}

```

All request will be made with: https://www.npmjs.com/package/fetch

### Set Resource ID Range

```
const migration = {
  source: {
    url: "http://origin.com/resource/",
    headers: {
      "content-type": "application/json"
    }
  },
  target: {
    url: "http://target.com/resource/",
    headers: {
      "content-type": "application/json"
    }
  },
  ids: {
    prefix: "some-resource-prefix-",
    from: 1,
    to: 200
  }
}

// This will copy:
// some-resource-prefix-1
// some-resource-prefix-2
// ...
// some-resource-prefix-200


```

### Wait for all migrations to finish

```
const runAll = async () => {
  await migrator.run();
}
runAll();
```
