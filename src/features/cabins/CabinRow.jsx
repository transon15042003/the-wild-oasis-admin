import styled from "styled-components";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";

import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import useDeleteCabin from "./useDeleteCabin";
import useInsertCabin from "./useInsertCabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
    const { isDeleting, deleteCabin } = useDeleteCabin();
    const { isInserting, insertCabin } = useInsertCabin();

    const {
        id: cabinId,
        image,
        name,
        max_capacity: maxCapacity,
        regular_price: regularPrice,
        discount,
        description,
    } = cabin;

    const copyCabin = {
        name: `Copy of ${name}`,
        image,
        max_capacity: maxCapacity,
        regular_price: regularPrice,
        discount,
        description,
    };

    return (
        <Table.Row role="row">
            <Img src={image} alt={`Cabin ${name}`} />

            <Cabin>{name}</Cabin>

            <div>Fits up to {maxCapacity} guests</div>

            <Price>{formatCurrency(regularPrice)}</Price>

            {discount ? (
                <Discount>{formatCurrency(discount)}</Discount>
            ) : (
                <span>&mdash;</span>
            )}

            <div>
                <Modal>
                    <Menus>
                        <Menus.Toggle id={cabinId} />

                        <Menus.List id={cabinId}>
                            <Menus.Button
                                icon={<HiSquare2Stack />}
                                onClick={() => insertCabin(copyCabin)}
                            >
                                Duplicate
                            </Menus.Button>

                            <Modal.Open openName="update">
                                <Menus.Button icon={<HiPencil />}>
                                    Edit
                                </Menus.Button>
                            </Modal.Open>

                            <Modal.Open openName="delete">
                                <Menus.Button icon={<HiTrash />}>
                                    Delete
                                </Menus.Button>
                            </Modal.Open>
                        </Menus.List>
                    </Menus>

                    <Modal.Window name="update">
                        <CreateCabinForm cabinToEdit={cabin} />
                    </Modal.Window>

                    <Modal.Window name="delete">
                        <ConfirmDelete
                            resourceName="cabin"
                            disabled={isDeleting}
                            onConfirm={() => deleteCabin(cabinId)}
                        />
                    </Modal.Window>
                </Modal>
            </div>
        </Table.Row>
    );
}

export default CabinRow;
