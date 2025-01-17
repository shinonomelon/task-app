import { Sidebar } from './components/sidebar';
import { TaskList } from './components/task-list';

export default async function Page() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <TaskList />
      </main>
    </div>
  );
}
