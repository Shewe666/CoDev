import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='landingWrapper'>

      {/* Navbar */}
      <nav className='landingNav'>
        <img src="/logo.png" alt="CoDev logo" className='navLogo' />
        <div className='navLinks'>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className='heroSection'>
        <div className='heroLeft'>
          <div className='heroBadge'>
            <span className='badgeDot'></span>
            REAL-TIME COLLABORATIVE CODING
          </div>

          <h1 className='heroTitle'>
            Code Together. <br />
            <span className='heroHighlight'>Build in Sync.</span>
          </h1>

          <p className='heroDesc'>
            Simple real-time collaborative code editor. Create a room, share
            the Room ID with your team, and start coding together instantly.
          </p>

          <button className='btn startBtn' onClick={() => navigate('/join')}>
            Start Coding <span>→</span>
          </button>
        </div>

        <div className='heroRight'>
          <div className='mockupWindow'>
            <div className='mockupHeader'>
              <div className='mockupDots'>
                <span className='dot dotRed'></span>
                <span className='dot dotYellow'></span>
                <span className='dot dotGreen'></span>
              </div>
              <span className='mockupTitle'>room.js — CoDev</span>
            </div>
            <pre className='mockupBody'>
<code>
{`function joinRoom(id, user) {
  socket.emit('join', {
    roomId: id,
    username: user
  });

  socket.on('sync', (code) => {
    editor.setValue(code);
  });
}`}
</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className='featuresSection'>
        <span className='sectionTag'>CAPABILITIES</span>
        <h2 className='sectionTitle'>Everything You Need</h2>

        <div className='featuresGrid'>
          <div className='featureCard'>
            <div className='featureIcon'>⚡</div>
            <h3>Real-Time Sync</h3>
            <p>See everyone's changes instantly, no refresh needed.</p>
          </div>
          <div className='featureCard'>
            <div className='featureIcon'>🧑‍🤝‍🧑</div>
            <h3>Any Room, Anytime</h3>
            <p>Create unlimited rooms, each with a unique Room ID.</p>
          </div>
          <div className='featureCard'>
            <div className='featureIcon'>💻</div>
            <h3>Clean Editor</h3>
            <p>Simple CodeMirror based editor, no clutter.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className='howSection'>
        <span className='sectionTag'>WORKFLOW</span>
        <h2 className='sectionTitle'>How It Works</h2>

        <div className='stepsGrid'>
          <div className='stepCard'>
            <div className='stepBadge'>01</div>
            <h3>Create or Join Room</h3>
            <p>Start a new room or enter an existing Room ID.</p>
          </div>
          <div className='stepCard'>
            <div className='stepBadge'>02</div>
            <h3>Invite Your Team</h3>
            <p>Share your Room ID with teammates instantly.</p>
          </div>
          <div className='stepCard'>
            <div className='stepBadge'>03</div>
            <h3>Code in Real-Time</h3>
            <p>Work together simultaneously in the editor.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className='contactSection'>
        <div className='contactCard'>
          <span className='sectionTag'>CONNECT</span>
          <h2 className='sectionTitle'>Get in Touch</h2>
          <p className='contactDesc'>
            Have questions, ideas, or feedback? Reach out directly to the CoDev team.
          </p>
          <a href="mailto:support@codev.dev" className='btn emailBtn'>
            support@codev.dev
          </a>
          <div className='socialLinks'>
            <a href="https://github.com/Shewe666/CoDev" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      {/* Footer - div use kiya hai, footer tag nahi, taaki App.css ka global footer{} style clash na kare */}
      <div className='landingFooter'>
        <h4>Built with💛by <a href='https://github.com/Shewe666/CoDev'>S&V</a></h4>
      </div>

    </div>
  );
};

export default Home;