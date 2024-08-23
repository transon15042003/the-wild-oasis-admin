import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        field="discount"
        options={[
          { value: "all", label: "All" },
          { value: "no-discount", label: "No discount" },
          { value: "with-discount", label: "With discount" },
        ]}
      />

      <SortBy
        options={[
          { value: "create_at-asc", label: "Sort By" },
          {
            value: "name-asc",
            label: "Name: A to Z",
          },
          {
            value: "name-desc",
            label: "Name: Z to A",
          },
          {
            value: "regular_price-asc",
            label: "Price: Low to High",
          },
          {
            value: "regular_price-desc",
            label: "Price: High to Low",
          },
          {
            value: "max_capacity-asc",
            label: "Capacity: Least to Most",
          },
          {
            value: "max_capacity-desc",
            label: "Capacity: Most to Least",
          },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
