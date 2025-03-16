import { StrictMode } from 'react';
import { Provider } from "react-redux"; // ✅ Removed Persistor
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store.js';
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <StrictMode>
        <App />
      </StrictMode>
    </PersistGate>
  </Provider>
);
