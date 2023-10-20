import React, { useEffect } from 'react';
import "./sidebar.scss";
import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useDispatch, useSelector } from 'react-redux';
import { logout, messageClear } from '../../store/Reducers/authReducer';



const Sidebar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { logoutMessage } = useSelector(state => state.auth);


  // logoutFunc
  const logoutFunc = () => {
    dispatch(logout(navigate))
  }


  // useEffect(() => {

  //   if (logoutMessage) {
  //     toast.success(logoutMessage)
  //     dispatch(messageClear())
  //     navigate('/login', { replace: true })
  //   }

  // }, [logoutMessage])


  return (
    <div className="sidebar">

      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Santobiswas</span>
        </Link>
      </div>

      <hr />
      <div className="center">

        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          {/* <Link to="/customers" style={{ textDecoration: "none" }}>
            <li>
              <DashboardCustomizeIcon className="icon" />
              <span>Customer</span>
            </li>
          </Link> */}
          <Link to="/bills" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Bill</span>
            </li>
          </Link>
          <Link to="/add-category" style={{ textDecoration: "none" }}>
            <li>
              <CategoryIcon className="icon" />
              <span>Category</span>
            </li>
          </Link>
          <Link to="/add-product" style={{ textDecoration: "none" }}>
            <li>
              <AddIcon className="icon" />
              <span>Add Product</span>
            </li>
          </Link>
          <Link to="/all-product" style={{ textDecoration: "none" }}>
            <li>
              <FormatListBulletedIcon className="icon" />
              <span>All Product</span>
            </li>
          </Link>
          <Link to="/cart-page" style={{ textDecoration: "none" }}>
            <li>
              <AddShoppingCartIcon className='icon' />
              <span>Cart</span>
            </li>
          </Link>


          {/* <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li> */}
          {/* <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li> */}

          <p className="title">USER</p>
          <Link to="/profile" style={{ textDecoration: "none" }}>

            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
          </Link>

          <span onClick={logoutFunc}>
            <li>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </span>
        </ul>

      </div>

      {/* <div className="bottom">
        <div className="colorOption">

        </div>
        <div className="colorOption">

        </div>
      </div> */}


    </div>
  )
}


export default Sidebar;