import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ReporterDashboard from './pages/ReporterDashboard';
import TravellerDashboard from './pages/TravellerDashboard';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
};

function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/reporter"
                        element={
                            <PrivateRoute>
                                <ReporterDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/traveller"
                        element={
                            <PrivateRoute>
                                <TravellerDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<LandingPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
