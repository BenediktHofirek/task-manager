"use client";

import { EditTodoForm } from "@/app/ui/edit-todo-form";
import { Modal } from "@/app/ui/modal";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTodoModalPage() {
  const { id } = useParams();
  const router = useRouter();

  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  useEffect(() => {
    const parsedId = Number(id);

    if (parsedId && Number.isInteger(parsedId)) {
      setEditedTodoId(parsedId);
    } else {
      router.replace("/todos");
    }
  }, [id, router]);

  if (!editedTodoId) return null;

  return (
    <Modal>
      <EditTodoForm id={editedTodoId} />
    </Modal>
  );
}
