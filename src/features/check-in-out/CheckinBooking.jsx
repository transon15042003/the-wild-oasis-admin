import styled from "styled-components";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";

import BookingDataBox from "../../features/bookings/BookingDataBox";
import { useMoveBack } from "../../hooks/useMoveBack";
import useBooking from "../bookings/useBooking";
import { useEffect, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { useCheckin } from "./useCheckin";
import useSettings from "../settings/useSettings";
import { formatCurrency } from "../../utils/helpers";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const moveBack = useMoveBack();
  const { booking, isPending } = useBooking();
  const { checkin, isCheckingIn } = useCheckin();
  const { settings, isPending: isGettingSettings } = useSettings();

  useEffect(() => {
    if (booking?.is_paid) {
      setConfirmPaid(true);
    }
  }, [booking?.is_paid]);

  if (isPending || isGettingSettings) return <Spinner />;

  const {
    id: bookingId,
    guests,
    total_price,
    num_guests,
    has_breakfast,
    num_nights,
    is_paid,
  } = booking;

  const totalBreakfastPrice =
    settings.breakfast_price * num_guests * num_nights;

  function handleCheckin() {
    const options = {
      has_breakfast: true,
      total_price: total_price + totalBreakfastPrice,
      extras_price: totalBreakfastPrice,
    };
    if (addBreakfast) {
      checkin({ bookingId, options });
    } else {
      checkin({ bookingId });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!has_breakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            id={`add-breakfast-${bookingId}`}
            disabled={isGettingSettings}
            onChange={() => {
              setAddBreakfast((addBreakfast) => !addBreakfast);
            }}
          >
            Want to add breakfast for {formatCurrency(totalBreakfastPrice)}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          id={`confirm-paid-${bookingId}`}
          onChange={() => setConfirmPaid((confirmPaid) => !confirmPaid)}
          disabled={is_paid || isCheckingIn}
        >
          I confirm that {guests.full_name} has paid the booking for{" "}
          {!addBreakfast
            ? formatCurrency(total_price)
            : `${formatCurrency(
                total_price + totalBreakfastPrice
              )} (${formatCurrency(total_price)} + ${formatCurrency(
                totalBreakfastPrice
              )} for breakfast)`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button disabled={!confirmPaid || isCheckingIn} onClick={handleCheckin}>
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
