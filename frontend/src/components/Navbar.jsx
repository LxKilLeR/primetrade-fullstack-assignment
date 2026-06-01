import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <strong className="text-xl font-bold text-gray-900">Task Manager</strong>
        </div>

        <nav className="flex items-center gap-4">
          <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" to="/">
            Home
          </Link>
          {!user ? (
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" to="/login">
              Login
            </Link>
          ) : null}
          {!user ? (
            <Link className="text-sm font-medium text-gray-600 hover:text-gray-900" to="/register">
              Register
            </Link>
          ) : null}
          {user ? <span className="text-sm font-medium text-gray-700">{user.name}</span> : null}
          {user ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
