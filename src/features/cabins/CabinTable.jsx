import { useSearchParams } from "react-router-dom";

import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import useCabins from "./useCabins";
import Table from "../../ui/Table";
// import Menus from "../../ui/Menus";

// const Table = styled.div`
//   width: 100%;
//   border: 1px solid var(--color-grey-200);

//   font-size: 1.4rem;
//   background-color: var(--color-grey-0);
//   border-radius: 7px;
//   overflow: hidden;
// `;

// const TableHeader = styled.header`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;

//   background-color: var(--color-grey-50);
//   border-bottom: 1px solid var(--color-grey-100);
//   text-transform: uppercase;
//   letter-spacing: 0.4px;
//   font-weight: 600;
//   color: var(--color-grey-600);
//   padding: 1.6rem 2.4rem;
// `;

function CabinTable() {
    const [searchParams] = useSearchParams();
    const filterValue = searchParams.get("discount") || "all";
    const sortValue = searchParams.get("sortBy") || "start_date-asc";
    const [field, direction] = sortValue.split("-");

    const { isPending, cabins } = useCabins();

    // Filter cabins based on discount
    let filteredCabins = cabins;

    if (filterValue === "no-discount") {
        filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
    } else if (filterValue === "with-discount") {
        filteredCabins = cabins?.filter((cabin) => cabin.discount > 0);
    }

    // Sort cabins
    let sortedCabins = filteredCabins?.sort((a, b) => a[field] - b[field]);
    if (direction === "desc") {
        sortedCabins = sortedCabins?.reverse();
    }

    if (isPending) return <Spinner />;

    return (
        // <Menus>
        <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 2fr">
            <Table.Header>
                <div role="columnheader"></div>
                <div role="columnheader">Cabin</div>
                <div role="columnheader">Capacity</div>
                <div role="columnheader">Price</div>
                <div role="columnheader">Discount</div>
                <div role="columnheader"></div>
            </Table.Header>

            <Table.Body
                data={sortedCabins}
                render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
            />
        </Table>
        // </Menus>
    );
}

export default CabinTable;
