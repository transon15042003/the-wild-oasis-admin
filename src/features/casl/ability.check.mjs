import assert from "node:assert/strict";
import { defineAbilityFor } from "./ability.js";

const demo = defineAbilityFor({ app_metadata: { role: "demo" } });
assert.equal(demo.can("create", "Cabin"), true);
assert.equal(demo.can("update", "Account"), false);
assert.equal(demo.can("reset", "DemoSandbox"), false);

const owner = defineAbilityFor({ app_metadata: { role: "owner" } });
assert.equal(owner.can("update", "Account"), true);
assert.equal(owner.can("reset", "DemoSandbox"), true);

const unknown = defineAbilityFor({ app_metadata: {} });
assert.equal(unknown.can("update", "Account"), false);

console.log("ability.check: ok");
