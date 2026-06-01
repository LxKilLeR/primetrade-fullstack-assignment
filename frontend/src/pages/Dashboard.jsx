import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const loadTasks = async (selectedStatus = filter) => {
    setLoading(true);
    setError('');
    setStatusMessage('');

    try {
      const params = { limit: 20 };
      if (selectedStatus) {
        params.status = selectedStatus;
      }
      const response = await api.get('/tasks', { params });
      setTasks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (task) => {
    setStatusMessage('');
    setError('');

    try {
      const response = await api.post('/tasks', task);
      setStatusMessage(response.data.message);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    setDeletingId(taskId);
    setStatusMessage('');
    setError('');

    try {
      const response = await api.delete(`/tasks/${taskId}`);
      setStatusMessage(response.data.message);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeletingId('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFilterChange = async (event) => {
    const nextFilter = event.target.value;
    setFilter(nextFilter);
    await loadTasks(nextFilter);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-xl bg-white px-6 py-8 shadow-md hover:shadow-lg transition duration-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
            <p className="mt-2 text-base text-gray-600">
              Track and manage your tasks easily. Role: {user?.role}.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter status:</label>
              <select
                value={filter}
                onChange={handleFilterChange}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {statusMessage ? <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-800">{statusMessage}</div> : null}
      {error ? <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800">{error}</div> : null}

      <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
        <aside>
          <TaskForm onSubmit={handleCreateTask} submitting={loading} />
        </aside>
        <section className="min-h-[400px] rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition duration-200">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Tasks</h2>
              <p className="mt-1 text-sm text-gray-500">View, filter, and manage all of your tasks.</p>
            </div>
            <button
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition duration-200"
              onClick={() => loadTasks()}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
              Loading tasks...
            </div>
          ) : (
            <TaskList tasks={tasks} onDelete={handleDeleteTask} deletingId={deletingId} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
