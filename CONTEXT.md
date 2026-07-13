# The Wild Oasis Admin

Hotel admin demo app used as a public Demo Sandbox for portfolio visitors.

## Language

**Demo Operator**:
A person who signs up and signs in to use the admin demo.
_Avoid_: Guest, visitor, admin user, account

**Hotel Guest**:
A person staying at the resort, stored in the `guests` table.
_Avoid_: Guest (alone), customer, client

**Demo Sandbox**:
The shared production environment where hotel data is periodically reset to seed defaults.
_Avoid_: Production hotel, real deployment, multi-tenant app

**Maintenance Window**:
A period when the Demo Sandbox rejects write operations and blocks normal login use.
_Avoid_: Downtime, outage, lock

**Demo Reset**:
Restoring shared hotel data (`cabins`, `guests`, `bookings`, `settings`) to the default seed while keeping Auth accounts.
_Avoid_: Wipe, hard delete, factory reset
