import { ToastContainer } from "react-toastify";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from "./components/screens/Login";
import OfficialContactForm from "./components/screens/OfficialContactForm";
import { AuthProvider } from './components/context/AuthContext.jsx';
import Register from "./components/screens/Register.jsx";
import CaseTable from "./components/screens/CaseTable.jsx";
import ProtectedScreen from "./components/screens/ProtectedScreen.jsx";
import SingleCaseBody from "./components/body/single-case-body.jsx";

export default function App() {


  return (
    <AuthProvider>
    <div>
    <Router>
      <Routes>

      <Route exact path="/" element={<Login />}/>
       
      <Route path="/contact-form/:id" element={<OfficialContactForm />}/>

      <Route path="/register" element={<Register />}/>

      <Route path="/case-table" element={<ProtectedScreen />}>
          <Route path="/case-table" element={<CaseTable />}/>
      </Route>

      <Route path="/case-table/:id" element={<ProtectedScreen />}>
          <Route path="/case-table/:id" element={<SingleCaseBody />}/>
      </Route>
    
      </Routes>

    </Router>
   

      <div>
        <ToastContainer />
      </div>
    </div>
    </AuthProvider>
  );
}
