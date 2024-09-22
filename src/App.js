import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AllTeam from './components/AllTeam';
import TeamData from './components/TeamData';
import AllCountry from "./components/AllCountry";
import AllLeague from "./components/AllLegue";
import FootballScores from './components/FootballScores';  // Import FootballScores component

import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav style={{ padding: '10px', background: '#333', color: '#fff', textAlign: 'center' }}>
          <Link to="/" style={{ margin: '10px', color: '#fff', textDecoration: 'none' }}>All Leagues</Link>
          <Link to="/football-scores" style={{ margin: '10px', color: '#fff', textDecoration: 'none' }}>Football Scores</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<AllLeague />} />
          <Route path="/league/:leagueName" element={<AllTeam />} />
          <Route path="/team/:teamName" element={<TeamData />} />
          <Route path="/football-scores" element={<FootballScores />} /> {/* New route for FootballScores */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
