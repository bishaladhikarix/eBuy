import './App.css';
import Navbar from '../components/navigation/Navbar';
import { Outlet } from 'react-router-dom';
function App() {


  return (
    <>
    
      <header className='header'>
        <Navbar/>
      </header>
      <main className='main'>
        <Outlet/>
      </main>
      <footer className='footer'>
        Copyright@2025 All rights reserved
      </footer>
      
    </>
  )
}

export default App;
