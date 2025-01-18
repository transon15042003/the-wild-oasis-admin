import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";

function AddCabin() {
    return (
        <Modal>
            <Modal.Open openName="cabin-form">
                <Button>Add new cabin</Button>
            </Modal.Open>
            <Modal.Window name="cabin-form">
                <CreateCabinForm />
            </Modal.Window>
        </Modal>
    );
}

// function AddCabin() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   return (
//     <>
//       <Button onClick={() => setIsModalOpen((showForm) => !showForm)}>
//         Add new cabin
//       </Button>
//       {isModalOpen && (
//         <Modal onClose={setIsModalOpen}>
//           <CreateCabinForm onCloseModal={setIsModalOpen} />
//         </Modal>
//       )}
//     </>
//   );
// }

export default AddCabin;
