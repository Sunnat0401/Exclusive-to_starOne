import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "./../Pages/Login/Login";
import Brand from "./../Pages/Brand/Brand";
import Categories from "./../Pages/Categories/Categories"
import Cities from "./../Pages/Cities/Cities"
import Locations from "./../Pages/Locations/Locations"
import Cars from "../Pages/Cars/Cars";
import Models from "./../Pages/Models/Models"
import Error from "../Pages/Error/Error";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    errorElement: <Error/>,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/brand",
        element: <Brand />,
      },
      {
        path: "/",
        element: <Categories/>,
      },
      {
        path: "/cities",
        element: <Cities/>,
      },
      {
        path: "/locations",
        element: <Locations/>,
      },
      {
        path: "/cars",
        element: <Cars/>,
      },
      {
        path: "/models",
        element: <Models/>,
      }
    ],
  },
]);

export default router;
