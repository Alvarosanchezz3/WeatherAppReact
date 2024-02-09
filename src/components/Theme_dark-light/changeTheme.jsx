import './changeTheme.css';
import React from 'react';

function ChangeTheme({ isDarkTheme, toggleTheme }) {
  return (
    <label className='switch'>
      {/* Usa el estado y la función de cambio de tema */}
      <input type='checkbox' checked={!isDarkTheme} onChange={toggleTheme} name='theme'/>
      <span className='slider'></span>
    </label>
  );
}

export default ChangeTheme;