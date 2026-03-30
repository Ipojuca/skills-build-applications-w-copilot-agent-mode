import './App.css';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import octofitLogo from './assets/octofitapp-small.png';

function App() {
  const navItems = [
    { to: '/activities', label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/teams', label: 'Teams' },
    { to: '/users', label: 'Users' },
    { to: '/workouts', label: 'Workouts' },
  ];

  return (
    <div className="App app-shell">
      <header className="app-header container py-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div className="brand-wrap d-flex align-items-center gap-3">
            <img className="brand-logo" src={octofitLogo} alt="OctoFit logo" />
            <div>
              <h1 className="display-6 fw-semibold mb-1">OctoFit Tracker</h1>
              <p className="text-secondary mb-0">Track. Team up. Climb the leaderboard.</p>
            </div>
          </div>
          <a
            className="btn btn-outline-primary btn-sm"
            href="https://getbootstrap.com/docs/5.3/getting-started/introduction/"
            target="_blank"
            rel="noreferrer"
          >
            Bootstrap Docs
          </a>
        </div>

        <nav className="navbar navbar-expand-lg mt-4 rounded-4 app-nav" aria-label="Main navigation">
          <div className="container-fluid px-3 py-2">
            <span className="navbar-brand fw-semibold">Sections</span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#octofitNav"
              aria-controls="octofitNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse show" id="octofitNav">
              <div className="navbar-nav flex-wrap gap-1 ms-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    className={({ isActive }) =>
                      `nav-link rounded-pill px-3 ${isActive ? 'active fw-semibold' : ''}`
                    }
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="container pb-5">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
