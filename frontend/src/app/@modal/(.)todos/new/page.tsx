import { CreateTodoForm } from "@/app/ui/create-todo-form";
import { Modal } from "@/app/ui/modal";

export default function Page() {
  return (
    <Modal>
      <CreateTodoForm />
    </Modal>
  );
}
