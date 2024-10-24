import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Appoinment from './Appoinment';
import ShowAppointment from './ShowAppointment';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
       <Route path ='/Appointment'  element={<Appoinment></Appoinment>} />
       <Route path ='/'  element={<HomePage />} />
       <Route path ='/show'  element={<ShowAppointment></ShowAppointment>} />

      </Routes>

    </div>
    </Router>
    
  );
}

export default App;
