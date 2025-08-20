import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import AllTeam from './components/AllTeam';
import TeamData from './components/TeamData';
import ThreeBackground from './components/ThreeBackground';
import AllCountry from "./components/AllCountry";
import AllLeague from "./components/AllLegue";
import FootballScores from './components/FootballScores';  
import Footer from './components/footer'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

// Navigation component with active link detection
const NavigationBar = () => {
  const location = useLocation();
  
  return (
    <Navbar className="glassmorphism-navbar fixed-top" variant="dark" expand="lg">
      <Container>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ display: 'inline-block' }}
            >
              ⚽
            </motion.span>
            <span className="ms-2">FootballScores</span>
          </Navbar.Brand>
        </motion.div>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`nav-link-enhanced ${location.pathname === '/' ? 'active' : ''}`}
                aria-label="View all football leagues"
              >
                <span className="nav-icon">🏆</span>
                <span>All Leagues</span>
              </Nav.Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Nav.Link 
                as={Link} 
                to="/football-scores" 
                className={`nav-link-enhanced ${location.pathname === '/football-scores' ? 'active' : ''}`}
                aria-label="Search for football teams"
              >
                <span className="nav-icon">🔍</span>
                <span>Search Team</span>
              </Nav.Link>
            </motion.div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Page wrapper with animations
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};


function App() {
  const location = useLocation();
  return (
    <motion.div className="App" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ThreeBackground />
      <div className="app-container">
        <NavigationBar />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><AllLeague /></AnimatedPage>} />
              <Route path="/league/:leagueName" element={<AnimatedPage><AllTeam /></AnimatedPage>} />
              <Route path="/team/:teamName" element={<AnimatedPage><TeamData /></AnimatedPage>} />
              <Route path="/football-scores" element={<AnimatedPage><FootballScores /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </motion.div>
  );
}
// ...existing code...

// Wrapper to provide Router context
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
