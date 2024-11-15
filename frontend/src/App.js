import './App.css';
import ParkingForm from './components/RouteForm';
import { motion } from 'motion/react';

function App() {
  return (
    <div className="main">
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <header></header>
        <ParkingForm />
      </motion.div>
    </div>
  );
}

export default App;
