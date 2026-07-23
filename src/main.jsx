import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import './index.css'
import router from './routers/Router.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
