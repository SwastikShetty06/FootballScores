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
    <Navbar className="glass-navbar fixed-top" variant="dark" expand="lg">
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
              style={{ display: 'inline-block', marginRight: '0.5rem' }}
            >
              ⚽
            </motion.span>
            FootballScores
          </Navbar.Brand>
        </motion.div>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-2">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="me-2">🏆</span>
              All Leagues
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/football-scores" 
              className={`nav-link-custom ${location.pathname === '/football-scores' ? 'active' : ''}`}
            >
              <span className="me-2">🔍</span>
              Search Team
            </Nav.Link>
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
