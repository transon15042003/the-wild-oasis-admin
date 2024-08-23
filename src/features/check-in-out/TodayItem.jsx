import styled from "styled-components";
import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import CheckoutButton from "./CheckoutButton";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({ activity }) {
  const {
    id,
    status,
    guests: { country_flag, nationality, full_name },
    num_nights,
  } = activity;

  return (
    <StyledTodayItem>
      {status === "unconfirmed" ? (
        <Tag type="green">Arriving</Tag>
      ) : (
        <Tag type="blue">Departing</Tag>
      )}

      <Flag src={country_flag} alt={`Flag of ${nationality}`} />
      <Guest>{full_name}</Guest>
      <span>{num_nights} nights</span>

      {status === "unconfirmed" ? (
        <Button
          size="small"
          variation="primary"
          as={Link}
          to={`/bookings/${id}`}
        >
          Check in
        </Button>
      ) : null}

      {status === "checked-in" ? <CheckoutButton bookingId={id} /> : null}
    </StyledTodayItem>
  );
}

export default TodayItem;
