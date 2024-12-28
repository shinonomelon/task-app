import { TodoList } from "@/components/todo-list";
import { TodoForm } from "@/components/todo-form";
import { LogoutButton } from "@/components/logout-button";

export default async function Page() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto relative">
        <div className="absolute top-0 right-0">
          <LogoutButton />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 pt-10">
          Todoアプリ
        </h1>
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
}
