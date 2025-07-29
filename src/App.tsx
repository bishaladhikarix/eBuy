import './App.css';
import Navbar from '../components/navigation/Navbar';
import { Outlet } from 'react-router-dom';
function App() {


  return (
    <div className='wrapper'>
    
      <header className='header'>
        <Navbar/>
      </header>
      <main className='main'>
        <Outlet/>
      </main>
      <footer className='footer'>
        <div className="foot-container">
          @COpyRight 2025 Allrights reserved.
        </div>
      </footer>
      
    </div>
  )
}

export default App;
