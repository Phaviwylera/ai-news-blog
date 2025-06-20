import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to fetch posts:', err));
  }, []);

  return (
    <div className="nyt-container">
      <header className="nyt-header">
        <h1>The AI Times</h1>
        <h2>International Edition</h2>
      </header>

      <main className="nyt-main">
        {posts.length === 0 ? (
          <p className="loading">Loading articles...</p>
        ) : (
          posts.map((article, i) => {
            const title = article.title || 'Untitled Article';
            const summary = article.summary || '';
            const section = article.section
              ? article.section.toLowerCase()
              : 'general';
            const image = article.image || null;

            return (
              <div className="article-card" key={i}>
                <div className="article-text">
                  <h3>{title}</h3>
                  <p>{summary}</p>
                  <span className="section-label">{section}</span>
                </div>
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="article-image"
                  />
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

export default App;
