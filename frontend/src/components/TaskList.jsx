const TaskList = ({ tasks, onDelete, deletingId }) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <p className="text-base font-medium text-gray-600">No tasks found.</p>
        <p className="mt-2 text-sm text-gray-400">Create your first task using the form on the left to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <article key={task._id} className="flex flex-col rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition duration-200">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {task.status}
            </span>
          </div>

          <p className="mt-4 flex-1 text-sm text-gray-600">{task.description || 'No description provided.'}</p>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created by: {task.createdBy?.name || 'You'}</span>
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>

            <button
              className="flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition duration-200 disabled:opacity-50"
              onClick={() => onDelete(task._id)}
              disabled={deletingId === task._id}
            >
              {deletingId === task._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default TaskList;
