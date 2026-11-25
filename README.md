# Renovate skips a locked Temurin pin

This example reproduces a lookup failure in Renovate's built-in `mise` manager.

## Reproduce the lookup failure

Run this command from the repository root with Docker:

```sh
docker run --rm --network none -v "$PWD:/repro:ro" \
  --entrypoint /usr/local/renovate/node renovate/renovate:44.263.4 \
  /repro/reproduce.mjs
```

The script uses the same [manifest](./mise.toml) and two fixed `java-version` releases for both
lookups. Only one lookup reads [the lockfile](./mise.lock). It does not install Java or run mise.

## Current behavior

With the lockfile, Renovate reports `skipReason: "invalid-version"` and finds no update.
Without the lockfile, it finds `21.0.13+9.0.LTS`.

## Expected behavior

Renovate should find the newer Temurin release with or without the lockfile.

## Link to the Renovate issue or Discussion

[#48396](https://github.com/renovatebot/renovate/discussions/48396)
