import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { GlobalConfig } from '/usr/local/renovate/dist/config/global.js';
import { presets } from '/usr/local/renovate/dist/config/presets/internal/workarounds.preset.js';
import { JavaVersionDatasource } from '/usr/local/renovate/dist/modules/datasource/java-version/index.js';
import { extractPackageFile } from '/usr/local/renovate/dist/modules/manager/mise/extract.js';
import { applyPackageRules } from '/usr/local/renovate/dist/util/package-rules/index.js';
import { lookupUpdates } from '/usr/local/renovate/dist/workers/repository/process/lookup/index.js';

const current = '21.0.12+8.0.LTS';
const next = '21.0.13+9.0.LTS';
const manifest = await readFile(new URL('./mise.toml', import.meta.url), 'utf8');

// Keep native extraction and lookup; replace only the network response.
JavaVersionDatasource.prototype.getReleases = async () => ({
  releases: [current, next].map((version) => ({ version })),
});

for (const [label, localDir] of [
  ['with lock', '/repro'],
  ['without lock', await mkdtemp(join(tmpdir(), 'mise-no-lock-'))],
]) {
  GlobalConfig.set({ localDir });
  const { deps: [dependency] } = await extractPackageFile(manifest, 'mise.toml');
  const config = await applyPackageRules({
    ...dependency,
    manager: 'mise',
    packageFile: 'mise.toml',
    rangeStrategy: 'auto',
    packageRules: presets.javaLTSVersions.packageRules,
  });
  const { val, err } = (await lookupUpdates({ ...config, updatePinnedDependencies: true })).unwrap();
  assert.ifError(err);
  const updates = val.updates.map(({ newValue }) => newValue);
  console.log(`${label}: ${JSON.stringify({
    lockedVersion: dependency.lockedVersion ?? null,
    skipReason: val.skipReason ?? null,
    updates,
  })}`);
  if (label === 'with lock') {
    assert.equal(dependency.lockedVersion, `temurin-${current}`);
    assert.equal(val.skipReason, 'invalid-version');
    assert.deepEqual(updates, []);
  } else {
    assert.deepEqual(updates, [next]);
  }
}
