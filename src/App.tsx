import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ImageProvider } from './context/ImageContext';
import HomePage from './pages/HomePage';
import BackgroundUpload from './pages/BackgroundUpload';
import TextUpload from './pages/TextUpload';
import CropPage from './pages/CropPage';
import CompositePage from './pages/CompositePage';

function App() {
  return (
    <ImageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/background-upload" element={<BackgroundUpload />} />
          <Route path="/text-upload" element={<TextUpload />} />
          <Route path="/crop" element={<CropPage />} />
          <Route path="/composite" element={<CompositePage />} />
        </Routes>
      </Router>
    </ImageProvider>
  );
}

export default App;
