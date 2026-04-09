import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSlider from "./components/HeroSlider";
import Categories from "./components/Categories";
import DealsOfDay from "./components/DealsOfDay";
import GreatDeals from "./components/GreatDeals";
import ProductCarousel from "./components/ProductCarousel";
import PromoBanner from "./components/PromoBanner";
import TelevisionsPage from "./components/TelevisionsPage";
import ProductDetailPage from "./components/ProductDetailPage";
import CartPage from "./components/CartPage";
import ProfilePage from "./components/ProfilePage";
import AddressPage from "./components/AddressPage";
import ProductListingPage from "./components/ProductListingPage";
import CategoryListingPage from "./components/CategoryListingPage";
import LoginPage from "./components/LoginPage";
import CheckoutPage from "./components/CheckoutPage";
import { hiddenDeals, whatsHot } from "./data/products";

function HomePage() {
  return (
    <>
      <HeroSlider />
      <Categories />
      <DealsOfDay />
      <GreatDeals />
      <ProductCarousel title="Hidden Deals Inside" items={hiddenDeals} visibleCount={4} navigateTo="/product" />
      <PromoBanner />
      <ProductCarousel title="What's Hot" items={whatsHot} visibleCount={4} cardStyle="floating" />
    </>
  );
}

// Redirect to /login if not authenticated; remember where the user was headed
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/televisions" element={<TelevisionsPage />} />
          <Route path="/product" element={<ProductDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/sony-tvs" element={<ProductListingPage />} />
          <Route path="/category/:name" element={<CategoryListingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/profile/:tab" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/address" element={<PrivateRoute><AddressPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
