import React from 'react';
const Footer = () => {
    return (
        <footer className="footer">
        <div className="footer-content">
            <div className="footer-left">
            <h3>FootballScores</h3> 
            </div>
            <div className="footer-right">
            <a href="https://github.com/SwastikShetty06/FootballScores" target="_blank" rel="noopener noreferrer">
                <img 
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                alt="GitHub Repository" 
                className="github-logo"
                />
            </a>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2024 SwastikShetty</p>
        </div>
        </footer>
    );
};

export default Footer;
