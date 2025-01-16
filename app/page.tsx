import { LogoutButton } from '@/components/logout-button';
import { TodoForm } from '@/components/todo-form';
import { TodoList } from '@/components/todo-list';

export default async function Page() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute right-0 top-0">
          <LogoutButton />
        </div>
        <h1 className="mb-8 pt-10 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Todoアプリ
        </h1>
        <TodoForm />
        <TodoList />
      </div>
    </div>
  );
}
