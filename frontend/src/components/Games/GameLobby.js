import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const GameLobby = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games/active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setGames(data);
    } catch (error) {
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (wagerAmount) => {
    try {
      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          wagerAmount,
          gameType: 'standard'
        })
      });
      const data = await response.json();
      if (response.ok) {
        fetchGames();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to create game');
    }
  };

  const joinGame = async (gameId) => {
    try {
      const response = await fetch(`/api/games/join/${gameId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        // Redirect to game room or update UI
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to join game');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Game Lobby</h1>
        <button
          onClick={() => createGame(10)} // Example wager amount
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create New Game
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game._id} className="border rounded p-4 shadow">
            <div className="flex justify-between mb-2">
              <span>Wager: ${game.wagerAmount}</span>
              <span>Players: {game.players.length}/2</span>
            </div>
            <button
              onClick={() => joinGame(game._id)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded"
              disabled={game.players.includes(user._id)}
            >
              Join Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLobby; 