import { CreateTodoForm } from "@/app/ui/create-todo-form";
import { Modal } from "@/app/ui/modal";

export default function CreateTodoModalPage() {
  return (
    <Modal>
      <CreateTodoForm />
    </Modal>
  );
}
