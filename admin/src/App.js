import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import UserInfo from "./pages/userInfo/userInfo";
import SpaceInfo from "./pages/spaceInfo/spaceInfo";
import RoomInfo from "./pages/roomInfo/roomInfo";
import OrderInfo from "./pages/orderInfo/orderInfo";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import {
  spaceColumns,
  roomColumns,
  userColumns,
  orderColumns,
} from "./datatablesource";
import NewSpace from "./pages/newSpace/NewSpace";
import NewRoom from "./pages/newRoom/NewRoom";
import UserEdit from "./pages/userEdit/userEdit";
import SpaceEdit from "./pages/spaceEdit/spaceEdit";
import RoomEdit from "./pages/roomEdit/roomEdit";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={userColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute>
                    <UserInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <New inputs={userInputs} title="Thêm tài khoản mới" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:userId"
                element={
                  <ProtectedRoute>
                    <UserEdit inputs={userInputs} title="Chinh sua tai khoan" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="spaces">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={spaceColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <SpaceInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewSpace title="Thêm cơ sở mới" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:spaceId"
                element={
                  <ProtectedRoute>
                    <SpaceEdit title="Chinh sua co so" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="rooms">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={roomColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute>
                    <RoomInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new"
                element={
                  <ProtectedRoute>
                    <NewRoom title="Thêm phòng mới" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:roomId"
                element={
                  <ProtectedRoute>
                    <RoomEdit title="Chinh sua phong" />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="order">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <List columns={orderColumns} />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <OrderInfo />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
