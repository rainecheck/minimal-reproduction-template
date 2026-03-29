# 42227

Minimal reproduction for https://github.com/renovatebot/renovate/discussions/42227

## Current behavior

`npm` is not considered for update. Debug reports it as an `unsupported-datasource`. 

```
DEBUG: packageFiles with updates (repository=rainecheck/minimal-reproduction-template, baseBranch=main)
       "config": {
         "mise": [
           {
             "deps": [
               {
                 "depName": "node",
                 "currentValue": "24",
                 "packageName": "node",
                 "datasource": "node-version",
                 "updates": [],
                 "versioning": "node",
                 "warnings": [],
                 "sourceUrl": "https://github.com/nodejs/node",
                 "registryUrl": "https://nodejs.org/dist",
                 "homepage": "https://nodejs.org",
                 "mostRecentTimestamp": "2026-03-24T00:00:00.000Z",
                 "currentVersion": "v24.14.1",
                 "currentVersionTimestamp": "2026-03-24T00:00:00.000Z",
                 "currentVersionAgeInDays": 5
               },
               {
                 "depName": "npm",
                 "skipReason": "unsupported-datasource",
                 "updates": [],
                 "packageName": "npm"
               }
             ],
             "packageFile": "mise.toml"
           }
         ]
       }
```

## Expected behavior

`deps -> npm` should behave similarly to `deps -> node` out of the box, returning an update to the latest npm (currently 11.12.1)

## Link to the Renovate issue or Discussion

Minimal reproduction for https://github.com/renovatebot/renovate/discussions/42227
