import React, { useEffect } from 'react';
import './Home.css'; // Import your custom CSS file

function Home() {
  useEffect(() => {
    const firstDivision = document.getElementById('division-1');
    const secondDivision = document.getElementById('division-2');
    let scrolling = false;

    window.addEventListener('scroll', () => {
      if (!scrolling) {
        if (window.scrollY > firstDivision.offsetTop + firstDivision.clientHeight / 2) {
          scrolling = true;
          secondDivision.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }, []);

  return (
    <div className="home-container">
      <div className="background-image">
        <div className="overlay">
          <div className="buttons-container" style={{ marginTop: '35vh' }}>
          <button className="button-arounder" onClick={() => window.location.href = '/login'}>
            <strong>Login</strong>
          </button>
          <button className="button-arounder" onClick={() => window.location.href = '/signup'}>
            <strong>Register</strong>
          </button>
          </div>
        </div>
      </div>
      </div>

       );
}

export default Home;
