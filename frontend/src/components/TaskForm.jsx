import { useState } from 'react';

const initialState = {
  title: '',
  description: '',
  status: 'pending'
};

const TaskForm = ({ onSubmit, submitting }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition duration-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Create a task</h3>
        <p className="mt-1 text-sm text-gray-500">Add a task with a title, description, and status.</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            required
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task description"
            rows="4"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Status</span>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-200"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
