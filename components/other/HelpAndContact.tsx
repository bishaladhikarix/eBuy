import React from 'react';
import './HelpAndContact.css';

const HelpAndContact: React.FC = () => {
  return (
    <div className="disclaimer-container">
      <div className="disclaimer-content">
        <p className="disclaimer-text">
          Be careful while buying the product as there is a chance of being scam. We are not responsible for anything.
        </p>
        
        <p className="contact-text">
          Contact 9844444444 if you have any confusion.
        </p>
        
        <p className="thank-you-text">
          Thankyou for using our service.
        </p>
      </div>
    </div>
  );
};

export default HelpAndContact;