import './App.css'
import { Outlet } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './pages/home/Footer'

function App() {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
