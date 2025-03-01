import { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const { user } = useAuth();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      setError(`Failed to fetch balance ${error}`);
    }
  };

  const handleDeposit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const data = await response.json();
      if (response.ok) {
        setBalance(data.newBalance);
        setAmount('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(`Deposit failed${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const data = await response.json();
      if (response.ok) {
        setBalance(data.newBalance);
        setAmount('');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(`Withdrawal failed${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Wallet</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <p className="text-gray-600">Current Balance</p>
        <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleDeposit}
            disabled={loading}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Deposit
          </button>
          <button
            onClick={handleWithdraw}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet; 