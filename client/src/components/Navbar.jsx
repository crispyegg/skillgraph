import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-indigo-600 font-bold text-lg">SkillGraph</span>
          <span className="text-xs text-slate-400 hidden sm:inline">skill-based job matching</span>
        </div>
        <div className="flex gap-1">
          <NavLink to="/jobs" className={linkClass}>Jobs</NavLink>
          <NavLink to="/candidates" className={linkClass}>Candidates</NavLink>
        </div>
      </div>
    </nav>
  );
}
