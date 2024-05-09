import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Space from "./pages/space/Space";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/register";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import ResetPassword from "./pages/resetPassword/resetPassword";
import VPao from "./pages/VPA/VPA";
import VPTG from "./pages/VPTG/VPTG";
import GT from "./pages/gioi-thieu/gioi-thieu";
import LH from "./pages/lien-he/lien-he";
import Profile from "./pages/profile/userProfile/userProfile";
import Password from "./pages/profile/userPassword/userPassword";
import Order from "./pages/profile/userOrder/userOrder";
import Payment from "./pages/paymentPage/paymentPage";
import PaymentSc from "./pages/paymentResult/paymentSuccess";
import PaymentCc from "./pages/paymentResult/paymentCancel";
import PolicyMember from "./pages/policyMember/policyMember";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<List />} />
        <Route path="/spaces/:id" element={<Space />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/van-phong-ao" element={<VPao />} />
        <Route path="/van-phong-tron-goi" element={<VPTG />} />
        <Route path="/gioi-thieu" element={<GT />} />
        <Route path="/lien-he" element={<LH />} />
        <Route path="/user">
          <Route path="profile" element={<Profile />} />
          <Route path="change-password" element={<Password />} />
          <Route path="order" element={<Order />} />
        </Route>
        <Route path="/payment" element={<Payment />} />
        <Route path="/success/:id" element={<PaymentSc />} />
        <Route path="/cancel/:id" element={<PaymentCc />} />
        <Route path="/policy-member" element={<PolicyMember />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
