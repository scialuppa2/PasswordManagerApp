import React from 'react';
import { useError } from './ErrorContext';

const ErrorMessage = () => {
  const { error, setError } = useError();

  if (!error) return null;

  return (
    <div style={{ color: 'red', padding: '10px', border: '1px solid red', position: 'relative' }}>
      {error}
      <button onClick={() => setError(null)} style={{ position: 'absolute', right: '10px', top: '10px' }}>
        Close
      </button>
    </div>
  );
};

export default ErrorMessage;
