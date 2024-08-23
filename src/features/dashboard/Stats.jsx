import Stat from "./Stat";
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";

function Stats({ bookings, confirmedStays, numDays, numCabins }) {
  // 1
  const totalBookings = bookings.length;
  // 2
  const sales = bookings.reduce((acc, booking) => acc + booking.total_price, 0);
  // 3
  const totalStays = confirmedStays.length;
  // 4
  const occupation =
    confirmedStays.reduce((acc, stay) => acc + stay.num_nights, 0) /
    (numDays * numCabins);

  return (
    <>
      <Stat
        title="Bookings"
        value={totalBookings}
        icon={<HiOutlineBriefcase />}
        color="blue"
      />
      <Stat
        title="Sales"
        value={sales}
        icon={<HiOutlineBanknotes />}
        color="green"
      />
      <Stat
        title="Check-ins"
        value={totalStays}
        icon={<HiOutlineCalendarDays />}
        color="indigo"
      />
      <Stat
        title="Occupancy rate"
        value={Math.round(occupation * 100) + "%"}
        icon={<HiOutlineChartBar />}
        color="yellow"
      />
    </>
  );
}

export default Stats;
