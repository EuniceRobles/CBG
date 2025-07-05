import React, { useState } from 'react';
  import './App.css';

  const bananaUrl = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';
  const chickenUrl = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';

  function getRandomImage() {
    // 50/50 chance for banana or chicken
    return Math.random() < 0.5 ? bananaUrl : chickenUrl;
  }

  function App() {
    // Create a 6x6 grid (36 images)
    const gridSize = 6 * 6;
    const [images, setImages] = useState(Array(gridSize).fill().map(getRandomImage));
    const [revealed, setRevealed] = useState(Array(gridSize).fill(false));
    const [currentPlayer, setCurrentPlayer] = useState(1); // player 1 or 2
    const [winner, setWinner] = useState(null); // 1 or 2 or 'draw'
    const [gameOver, setGameOver] = useState(false);

    const bananaCount = revealed.filter((r, i) => r && images[i] === bananaUrl).length;
    const chickenCount = revealed.filter((r, i) => r && images[i] === chickenUrl).length;
    const totalRevealed = bananaCount + chickenCount;
    const bananaPercent = totalRevealed ? ((bananaCount / totalRevealed) * 100).toFixed(1) : 0;
    const chickenPercent = totalRevealed ? ((chickenCount / totalRevealed) * 100).toFixed(1) : 0;

    // Calculate how many bananas and chickens have been revealed
    const totalBananas = images.filter(img => img === bananaUrl).length;
    const totalChickens = images.filter(img => img === chickenUrl).length;
    const bananaPercentRevealed = totalBananas ? ((bananaCount / totalBananas) * 100).toFixed(1) : 0;
    const chickenPercentRevealed = totalChickens ? ((chickenCount / totalChickens) * 100).toFixed(1) : 0;

    // Remove playerChoice state, use currentPlayer to determine role
    const getPlayerRole = (player) => (player === 1 ? 'chicken' : 'banana');

    // Reveal a single image on click
    const handleReveal = (index) => {
      if (revealed[index] || gameOver) return;
      const playerRole = getPlayerRole(currentPlayer);
      setRevealed(prev => prev.map((r, i) => (i === index ? true : r)));
      const actual = images[index] === bananaUrl ? 'banana' : 'chicken';
      if (playerRole !== actual) {
        setWinner(currentPlayer === 1 ? 2 : 1);
        setGameOver(true);
      } else {
        // Continue to next player
        setCurrentPlayer(p => (p === 1 ? 2 : 1));
      }
    };

    // Reset the board and all state
    const handleReset = () => {
      setImages(Array(gridSize).fill().map(getRandomImage));
      setRevealed(Array(gridSize).fill(false));
      setCurrentPlayer(1);
      setWinner(null);
      setGameOver(false);
    };

    return (
      <div className="container">
        <h1> Chicken Banana Game!</h1>
        <button onClick={handleReset} style={{marginBottom: '15px'}}>Reset Board</button>
        <div style={{marginBottom: '10px', fontWeight: 'bold'}}>
          Bananas revealed:  ({bananaPercentRevealed}%) | Chickens revealed: ({chickenPercentRevealed}%)
        </div>
        <div style={{marginBottom: '10px', fontWeight: 'bold'}}>
          {gameOver ? (
            winner === 'draw' ? 'Draw!' : `Player ${winner} wins!`
          ) : (
            <>
              Player {currentPlayer}'s turn as <b>{getPlayerRole(currentPlayer).charAt(0).toUpperCase() + getPlayerRole(currentPlayer).slice(1)}</b>. Click a square!
            </>
          )}
        </div>
        <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
          justifyItems: 'center',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {images.map((img, index) => (
            <div key={index} style={{ width: '80px', height: '80px', position: 'relative' }}>
              {revealed[index] ? (
                <img
                  src={img}
                  alt={img === bananaUrl ? 'Banana' : 'Chicken'}
                  className="square"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'default' }}
                />
              ) : (
                <div
                  onClick={() => handleReveal(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    background: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: gameOver ? 'not-allowed' : 'pointer',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    userSelect: 'none',
                    opacity: gameOver ? 0.5 : 1,
                  }}
                >
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default App;
