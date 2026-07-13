# The Wild Oasis Admin

Public portfolio Demo Sandbox of a boutique-hotel admin console. Visitors become Demo Operators, share one hotel dataset, and accept periodic Demo Resets.

Glossary only — no deployment or implementation detail. Ops and architecture live under [docs/](docs/README.md).

## Language

### People

**Demo Operator**:
A person who registers and signs in to operate the admin Demo Sandbox.
_Avoid_: Guest, visitor, admin user, account, user (alone)

**Hotel Guest**:
A person staying at the resort; a row in hotel guest records, not a Demo Operator.
_Avoid_: Guest (alone), customer, client, visitor

### Demo Sandbox

**Demo Sandbox**:
The shared live environment where every Demo Operator works on the same hotel data, which is restored on a schedule.
_Avoid_: Production hotel, real property system, multi-tenant app, staging (alone)

**Hotel Data**:
The shared operational records of the sandbox hotel — cabins, Hotel Guests, bookings, and settings — distinct from Auth identities.
_Avoid_: Database (alone), everything, user data

**Seed**:
The default Hotel Data snapshot that a Demo Reset restores to.
_Avoid_: Backup, fixture dump, factory image

**Demo Reset**:
An operation that replaces current Hotel Data with the Seed while leaving Demo Operator Auth identities in place.
_Avoid_: Wipe, hard delete, factory reset, truncate (alone)

**Maintenance Window**:
A timed period when the Demo Sandbox refuses writes and blocks normal signed-in use so a Demo Reset can finish safely.
_Avoid_: Downtime, outage, lock, freeze

**Write Quota**:
A per–Demo Operator cap on mutating hotel operations within a time window, to limit abuse of the shared Demo Sandbox.
_Avoid_: Rate limit (alone), throttle, API quota (generic)

### Hotel domain

**Cabin**:
A bookable lodging unit in the sandbox hotel.
_Avoid_: Room, property, listing

**Booking**:
A stay reservation linking a Hotel Guest to a Cabin over a date range.
_Avoid_: Order, reservation (prefer Booking in this codebase), trip

**Settings**:
The single shared hotel policy record (lengths of stay, breakfast price, guest limits, and similar).
_Avoid_: Config, preferences, env
