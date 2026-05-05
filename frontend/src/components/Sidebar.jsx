// Sidebar.jsx
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/stocks', label: 'Stocks' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/tax', label: 'Tax' },
  { to: '/splitwise', label: 'Shared Expenses' },  // ← add this
];


export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 border-r border-slate-800 flex-col bg-slate-950">
      <nav className="mt-4 space-y-1 px-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-300 hover:bg-slate-900'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
