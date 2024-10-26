import React, { useState } from 'react';
import './LoveYou.css';

const LoveYou: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    setShowMessage(true);
  };

  return (
    <div className="love-you-container">
      <button className="button" onClick={handleClick}>Click Me!</button>
      <h1 className={`love-message ${showMessage ? 'visible' : ''}`}>I love you ❤️</h1>
    </div>
  );
};

export default LoveYou;
