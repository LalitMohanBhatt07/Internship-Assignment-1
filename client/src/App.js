import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Signup from './components/Signup';
import OTPForm from './components/OtpForm';
import Dashboard from './components/Dashboard';
import LoginForm from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/verify-otp' element={<OTPForm />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/' element={<LoginForm />}/>

      </Routes>
    </Router>
  );
}
export default App;
