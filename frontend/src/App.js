import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/news')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        console.log('Fetched posts:', data); // ✅ Check this in browser DevTools
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app" style={{ fontFamily: '"Roboto", sans-serif', maxWidth: '800px', margin: 'auto', padding: '1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#d71920' }}>India Today - Curated Summaries</h1>
        <hr />
      </header>

      <main>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <article key={index} style={{ padding: '1rem 0', borderBottom: '1px solid #ddd' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#222' }}>{post.title}</h2>
              <p style={{ fontSize: '1rem', color: '#444' }}>{post.summary}</p>
              <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ color: '#d71920' }}>
                Read full article on India Today
              </a>
            </article>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </main>

      <footer>
        <p style={{
          fontSize: '0.85rem',
          color: '#555',
          marginTop: '2rem',
          padding: '1rem',
          borderTop: '1px solid #ccc',
          textAlign: 'center'
        }}>
          This site provides curated summaries of news content with proper attribution.
          Full articles are available on the original publisher’s website.
        </p>
      </footer>
    </div>
  );
}

export default App;
