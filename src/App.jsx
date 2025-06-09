import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Signup,
  Profile,
  Schemes,
  Jobs,
  Search,
  Admin,
  SchemeDetail,
  Analytics,
  TestPage,
} from "./pages";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
      <Router>
        <div className="w-[100vw] mx-auto">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/schemes/:id" element={<SchemeDetail />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/search" element={<Search />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}
