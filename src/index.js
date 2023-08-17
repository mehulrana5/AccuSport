import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-lcdftzmkoc2a272u.au.auth0.com"
    clientId="qCu1L5elZxnp139dBRYXmRpXtox6zGeD"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
);