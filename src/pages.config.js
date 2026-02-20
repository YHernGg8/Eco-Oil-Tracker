/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Admin from './pages/Admin.jsx';
import AdminCenters from './pages/AdminCenters.jsx';
import AdminDisposals from './pages/AdminDisposals.jsx';
import AdminRewards from './pages/AdminRewards.jsx';
import Centers from './pages/Centers.jsx';
import History from './pages/History.jsx';
import Home from './pages/Home.jsx';
import LogDisposal from './pages/LogDisposal.jsx';
import Profile from './pages/Profile.jsx';
import Rewards from './pages/Rewards.jsx';
import Integrations from './pages/Integrations.jsx';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "AdminCenters": AdminCenters,
    "AdminDisposals": AdminDisposals,
    "AdminRewards": AdminRewards,
    "Centers": Centers,
    "History": History,
    "Home": Home,
    "LogDisposal": LogDisposal,
    "Profile": Profile,
    "Rewards": Rewards,
    "Integrations": Integrations,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};