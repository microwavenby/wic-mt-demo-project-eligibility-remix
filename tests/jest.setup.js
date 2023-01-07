import { installGlobals } from "@remix-run/node"; // or cloudflare/deno
// Set up Axe
require('@testing-library/jest-dom')
const { toHaveNoViolations } = require('jest-axe')
expect.extend(toHaveNoViolations)

// This installs globals such as "fetch", "Response", "Request" and "Headers".
installGlobals();
