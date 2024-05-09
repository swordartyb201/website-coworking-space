import "./userProfile.css";
import React from "react";
import Sidebar from "../../../components/profile/sidebar/sidebar";
import UserProfile from "../../../components/profile/editProfile/editProfile";
import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";
import MenuList from "../../../components/menubar/MenuBar";

const Profile = () => {
  return (
    <div>
      <Navbar />
      <MenuList />
      <div className="userProfile-container">
        <Sidebar className="userProfile-sidebar" />
        <UserProfile className="userProfile-edit" />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
