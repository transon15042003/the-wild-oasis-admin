import fs from "fs";
import { add } from "date-fns";

const guestsSrc = fs.readFileSync("./src/data/data-guests.js", "utf8");
const guests = new Function(
    `${guestsSrc.replace("export const guests =", "return ")}`
)();

const imageUrl =
    "https://tpzkqxwytqlubdvdszlz.supabase.co/storage/v1/object/public/cabin_images/";
const cabinsSrc = fs
    .readFileSync("./src/data/data-cabins.js", "utf8")
    .replace(/^import .*$/m, "")
    .replace(/const imageUrl[\s\S]*?;/, `const imageUrl = "${imageUrl}";`)
    .replace("export const cabins =", "return ");
const cabins = new Function(cabinsSrc)();

const bookingsSrc = fs.readFileSync("./src/data/data-bookings.js", "utf8");
const relativeBookings = [];
const re =
    /\{\s*created_at: fromToday\((-?\d+)(?:, true)?\),\s*start_date: fromToday\((-?\d+)\),\s*end_date: fromToday\((-?\d+)\),\s*cabin_id: (\d+),\s*guest_id: (\d+),\s*has_breakfast: (true|false),\s*observations:\s*("(?:\\.|[^"\\])*"),\s*is_paid: (true|false),\s*num_guests: (\d+),?\s*\}/g;

let match;
while ((match = re.exec(bookingsSrc)) !== null) {
    relativeBookings.push({
        created_at_days: Number(match[1]),
        created_at_with_time: match[0].includes("created_at: fromToday(" + match[1] + ", true)"),
        start_date_days: Number(match[2]),
        end_date_days: Number(match[3]),
        cabin_id: Number(match[4]),
        guest_id: Number(match[5]),
        has_breakfast: match[6] === "true",
        observations: JSON.parse(match[7]),
        is_paid: match[8] === "true",
        num_guests: Number(match[9]),
    });
}

// Fix with_time detection
const relativeBookingsFixed = [];
const re2 =
    /created_at: fromToday\((-?\d+)(, true)?\),\s*start_date: fromToday\((-?\d+)\),\s*end_date: fromToday\((-?\d+)\),\s*cabin_id: (\d+),\s*guest_id: (\d+),\s*has_breakfast: (true|false),\s*observations:\s*("(?:\\.|[^"\\])*"),\s*is_paid: (true|false),\s*num_guests: (\d+)/g;
while ((match = re2.exec(bookingsSrc)) !== null) {
    relativeBookingsFixed.push({
        created_at_days: Number(match[1]),
        created_at_with_time: Boolean(match[2]),
        start_date_days: Number(match[3]),
        end_date_days: Number(match[4]),
        cabin_id: Number(match[5]),
        guest_id: Number(match[6]),
        has_breakfast: match[7] === "true",
        observations: JSON.parse(match[8]),
        is_paid: match[9] === "true",
        num_guests: Number(match[10]),
    });
}

fs.mkdirSync("supabase/functions/reset-demo", { recursive: true });
fs.writeFileSync(
    "supabase/functions/reset-demo/seed-guests.json",
    JSON.stringify(guests)
);
fs.writeFileSync(
    "supabase/functions/reset-demo/seed-cabins.json",
    JSON.stringify(cabins)
);
fs.writeFileSync(
    "supabase/functions/reset-demo/seed-bookings.json",
    JSON.stringify(relativeBookingsFixed)
);

console.log({
    guests: guests.length,
    cabins: cabins.length,
    bookings: relativeBookingsFixed.length,
});

// sanity: fromToday still available for local check
void add;
