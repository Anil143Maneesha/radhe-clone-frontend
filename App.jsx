import React, { useState } from "react";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState("");

  const login = async () => {
    const resp = await fetch("/api/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username:"demo", password:"demo"})
    });
    const data = await resp.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      fetchBalance(data.token);
    }
  };

  const fetchBalance = async (tok) => {
    const resp = await fetch("/api/balance", {
      headers: {"Authorization": "Bearer " + tok}
    });
    const data = await resp.json();
    setBalance(data.balance);
  };

  const placeBet = async () => {
    const resp = await fetch("/api/bet", {
      method: "POST",
      headers: {"Content-Type":"application/json", "Authorization": "Bearer " + token},
      body: JSON.stringify({ amount: Number(bet) })
    });
    const data = await resp.json();
    alert(data.message + (data.result ? ` — it was ${data.result}!` : ""));
    fetchBalance(token);
  };

  if (!token) {
    return <button onClick={login}>Login as Demo</button>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Wallet Balance: ₹{balance.toFixed(2)}</h1>
      <input
        type="number"
        placeholder="Bet amount"
        value={bet}
        onChange={e => setBet(e.target.value)}
      />
      <button onClick={placeBet} disabled={!bet}>Flip Coin</button>
    </div>
  );
}
