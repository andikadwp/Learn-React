import { useEffect, useState } from 'react'
import './App.css'
function App() {
  const [count, setCount] = useState(1);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const start = async () => {
    setLoading(true); // Show loading when starting
    setStarted(true);
    try {
      const response = await fetch(`https://dummyjson.com/posts/1`);
      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
      }
      const data = await response.json();
      setArticle(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setArticle(null);
    } finally {
      setLoading(false); // Hide loading after fetching
    }
  };

  const next = () => setCount(count + 1);
  const prev = () => setCount(count > 1 ? count - 1 : 1);

  useEffect(() => {
    if (!started || count === 1) return; // Skip fetching when starting
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/posts/${count}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${response.statusText}`);
        }
        const data = await response.json();
        setArticle(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setArticle(null);
      }
    };

    fetchArticle();
  }, [count, started]);

  return (
    <>
      <h1>Articles</h1>
      {!started ? (
        <div className="button-start mt-4">
          <button onClick={start}>Start</button>
        </div>
      ) : (
        <>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div id="articles">
              <div className="card flex gap-2 justify-between">
                <button onClick={prev} disabled={count === 1}>
                  Prev
                </button>
                <button onClick={next}>Next</button>
              </div>
              {article && (
                <div className="articles card text-center py-2 max-w-3xl">
                  <h3 className="font-bold mb-1">{article.title}</h3>
                  <p>{article.body}</p>
                </div>
              )}
              <div className="mt-2 p-2">
                <p>Article {count}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;

