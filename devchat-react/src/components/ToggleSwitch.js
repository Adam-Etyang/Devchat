import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, disabled }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
    <span className="slider"></span>
  </label>
);

export default ToggleSwitch; 