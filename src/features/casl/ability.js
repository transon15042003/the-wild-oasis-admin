import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  const role = user?.app_metadata?.role;

  if (role === "owner") {
    can("manage", "all");
  } else {
    can("read", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    can("create", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    can("update", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    can("delete", ["Cabin", "Booking", "Settings", "HotelGuest"]);
    cannot("update", "Account");
    cannot("reset", "DemoSandbox");
  }

  return build();
}
