import React, { useState } from 'react';
  import './App.css';
  
  const bananaUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNYit0d79tjmgyI8ZyKxJRld02Iz2kGsjDiQ&s';
  const chickenUrl = 'https://cdn-icons-png.flaticon.com/512/10132/10132012.png';

  function getRandomImage() {
  // 50/50 chance for banana or chicken
  return Math.random() < 0.50 ? bananaUrl : chickenUrl;
}

  function App() {
    // Create a 6x6 grid (36 images)
    const gridSize = 6 * 6;
    let chickenI = 18;
    const [images, setImages] = useState(Array(gridSize).fill().map(() => getRandomImage() === chickenUrl && chickenI-- > 0 ? chickenUrl : bananaUrl));
    const [revealed, setRevealed] = useState(Array(gridSize).fill(false));
    const [currentPlayer, setCurrentPlayer] = useState(1); // player 1 or 2
    const [winner, setWinner] = useState(null); // 1 or 2 or 'draw'
    const [gameOver, setGameOver] = useState(false);
    

    const bananaCount = revealed.filter((r, i) => r && images[i] === bananaUrl).length;
    const chickenCount = revealed.filter((r, i) => r && images[i] === chickenUrl).length;

    // Calculate how many bananas and chickens have been revealed
    const totalBananas = images.filter(img => img === bananaUrl).length;
    const totalChickens = images.filter(img => img === chickenUrl).length;
    const bananaPercentRevealed = totalBananas ? Math.round(((bananaCount / totalBananas) * 100)) : 0;
    const chickenPercentRevealed = totalChickens ? Math.round(((chickenCount / totalChickens)) * 100): 0;

    // Remove playerChoice state, use currentPlayer to determine role
    const getPlayerRole = (player) => (player === 1 ? 'chicken' : 'banana');

    // Switches the player roles (chicken <-> banana)
    const switchPlayerRole = () => {
      setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    };


    // Reveal a single image on click
    const handleReveal = (index) => {
      if (revealed[index] || gameOver) return;
      const playerRole = getPlayerRole(currentPlayer);
      setRevealed(prev => prev.map((r, i) => (i === index ? true : r)));
      const actual = images[index] === bananaUrl ? 'banana' : 'chicken';
      if (playerRole !== actual) {
        setWinner(currentPlayer === 1 ? 2 : 1);
        setGameOver(true);
        // Reveal all tiles when someone loses
        setRevealed(Array(gridSize).fill(true));
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

    // Reset board when 'r'/'R' is pressed
    React.useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'r' || e.key === 'R') {
          handleReset();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Switch player role when 's'/'S' is pressed

    return (
      <div className="container">
        <h1> Chicken Banana Game!</h1>
        <div style={{marginBottom: '10px'}}>
          Bananas revealed:  <b>({bananaPercentRevealed}%)</b> | Chickens revealed: <b>({chickenPercentRevealed}%)</b>
        </div>
        <div style={{marginBottom: '10px', fontWeight: 'bold'}}>
          {gameOver ? (
            <>
              {winner === 'draw' ? (
                'Draw!'
              ) : (
                <>
                  {`Player ${winner} wins!`}
                  <div style={{ marginTop: '16px' }}>
                    {winner === 1 && (
                      <imgs
                        src="https://img.itch.zone/aW1hZ2UvNDc4NTkvMjExMjY5LmdpZg==/original/iEdCFj.gif"
                        alt="Player 1 Wins"
                        style={{ width: '180px', borderRadius: '12px', boxShadow: '0 2px 12px #ffe13555' }}
                      />
                    )}
                    {winner === 2 && (
                      <img
                        src="https://img.itch.zone/aW1hZ2UvNDc4NTkvMjExMjYyLmdpZg==/original/V5R6XE.gif"
                        alt="Player 2 Wins"
                        style={{ width: '180px', borderRadius: '12px', boxShadow: '0 2px 12px #ffe13555' }}
                      />
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              It's <b>{getPlayerRole(currentPlayer).toUpperCase()}</b>'s turn. Click a square!
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
          fontFamily: 'Impact, Charcoal, sans-serif',
        }}
      >
        {index + 1}
      </div>
    )}
  </div>
))}

        </div>
        <button
          onClick={switchPlayerRole}
          disabled={revealed.some(r => r)} // Disable if any tile is revealed
          style={{
            marginBottom: '16px',
            fontWeight: 'bold',
            background: '#ffe135',
            color: '#7a5c00',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            padding: '10px 28px',
            boxShadow: '0 2px 8px #ffe13544',
            cursor: revealed.some(r => r) ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, transform 0.1s'
          }}
        >
          Switch Player
        </button>
        <button
          onClick={handleReset}
          style={{
            marginBottom: '16px',
            fontWeight: 'bold',
            background: '#ffe135',
            color: '#7a5c00',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            padding: '10px 28px',
            boxShadow: '0 2px 8px #ffe13544',
            cursor: revealed.some(r => r) ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, transform 0.1s'
          }}
        >
          Reset Game
        </button>
      </div>
      
    );
  }

  export default App;
