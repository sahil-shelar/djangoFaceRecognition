// SuccessPage.js
import React from 'react';

const SuccessPage = ({ userName }) => {
  return (
    <div className='success'>
      <h1>Login Successful</h1>
      <p>Face Authenticated, {userName}!</p>
      <p>Your Entry Has been Registered in Database</p>
    </div>
  );
};

export default SuccessPage;
