import Navbar from './Navbar';
import Footer from './Footer'; 

export default function Layout({ children }) {
  return (
    
    <div className=' p-0'>
      <Navbar /> 
      <main className="flex-1 min-h-screen">{children}</main>
      <Footer /> 
      </div>
    
  );
}