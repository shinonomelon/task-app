"use server";

import { ActionResponse, Todo } from "../types/todo";
import { supabase } from "../lib/supabase";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Validation schema for todo
const todoSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export async function addTodo(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Extract and validate input
    const rawData: Pick<Todo, "text"> = {
      text: formData.get("text") as string,
    };

    const validatedData = todoSchema.safeParse(rawData);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Failed to add todo",
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Insert validated data into the database
    const { error } = await supabase
      .from("todos")
      .insert([{ text: validatedData.data.text }])
      .select();

    if (error) {
      return {
        success: false,
        message: "Failed to add todo",
        errors: {
          text: [error.message],
        },
      };
    }
    revalidatePath("/");

    return {
      success: true,
      message: "Todo added successfully",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export async function deleteTodo(id: number): Promise<ActionResponse> {
  try {
    if (typeof id !== "number") {
      return {
        success: false,
        message: "Failed to delete todo",
        errors: {
          id: ["ID is required"],
        },
      };
    }

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return {
        success: false,
        message: "Failed to delete todo",
        errors: {
          id: [error.message],
        },
      };
    }
    revalidatePath("/");

    return {
      success: true,
      message: "Todo deleted successfully",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export async function toggleTodoCompleted(
  id: number,
  completed: boolean
): Promise<ActionResponse> {
  try {
    if (typeof id !== "number") {
      return {
        success: false,
        message: "Failed to update todo",
        errors: {
          id: ["ID is required"],
        },
      };
    }

    const { error } = await supabase
      .from("todos")
      .update({ completed: completed })
      .eq("id", id)
      .select();

    if (error) {
      return {
        success: false,
        message: "Failed to update todo",
        errors: {
          id: [error.message],
        },
      };
    }
    revalidatePath("/");

    return {
      success: true,
      message: "Todo updated successfully",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
