'use client'
import { useState } from 'react';

export default function Page() {
  const [username, setUsername] = useState('');
  const [response, setResponse] = useState(null);

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const checkUsername = async () => {
    try {
      const res = await fetch('https://72a4-2401-4900-7b71-31a1-df67-3cf8-3acc-7767.ngrok-free.app/api/v1/user/check/username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await res.json();
      setResponse(result);
      console.log('response' + result);
    } catch (error) { console.log(error) }
  };

  return (
    <div>
      <h1>Check Username</h1>
      <input
        type="text"
        className='bg-black'
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter username"
      />
      <button onClick={checkUsername}>Check</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}