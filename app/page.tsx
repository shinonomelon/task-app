import { TodoList } from "@/components/todo-list";
import { TodoForm } from "../components/todo-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Todoアプリ
        </h1>
        <TodoForm />
        <div className="mt-8">
          <TodoList />
        </div>
      </div>
    </div>
  );
}
