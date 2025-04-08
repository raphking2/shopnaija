import React, { useState } from 'react';
import './CopilotWidget.css'; // Create this CSS file

const CopilotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`copilot-widget ${isOpen ? 'open' : ''}`}>
      <div className="widget-header" onClick={() => setIsOpen(!isOpen)}>
        <span>Need help?</span>
        <span className="toggle-icon">{isOpen ? '×' : '💬'}</span>
      </div>
      {isOpen && (
        <iframe 
          src="https://copilotstudio.microsoft.com/environments/Default-804b1c9a-f4c5-498c-a4ab-71f1e249e369/bots/cr9fb_agent/webchat?__version__=2" 
          className="widget-iframe"
          frameBorder="0"
          title="Copilot Assistant"
        />
      )}
    </div>
  );
};

export default CopilotWidget;