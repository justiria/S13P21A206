import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import CalendarPage from "./pages/CalendarPage";
import CartoonPage from "./pages/CartoonPage";
import CartoonResultPage from "./pages/CartoonResultPage";
import CoupleConnectionPage from "./pages/CoupleConnectionPage";
import DictionaryPage from "./pages/DictionaryPage";
import GalleryPage from "./pages/GalleryPage";
import LetterPage from "./pages/LetterPage";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import TalkPage from "./pages/TalkRoomPage";
import WebRtcPage from "./pages/WebRtcPage";
import AdditionalInfoPage from "./components/coupleConnection/AdditionalInfoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnBoardingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/connection" element={<CoupleConnectionPage />} />
          <Route path="/additional-info" element={<AdditionalInfoPage />} /> 
          <Route path="/ai" element={<MainPage />} />
          <Route path="/talk" element={<TalkPage />} />
          <Route path="/webrtc" element={<WebRtcPage />} />
          <Route path="/cartoon" element={<CartoonPage />} />
          <Route path="/letters" element={<LetterPage />} />
          <Route path="/cartoon-result" element={<CartoonResultPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
