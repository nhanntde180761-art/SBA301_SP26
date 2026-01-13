import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import Orchids from './components/ListOfCorchid';
import Header from './components/Header';
import Footer from './components/Footer';
import TestCount from './components/TestCount';
function App() {
  return(
    <>
    <NavBar/>
    <Header/>
    <Orchids/>
    <TestCount/>
    <Footer/>
    </>
  )
}
export default App;
