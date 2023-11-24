import { Outlet } from "react-router-dom";
import Header from "./Header";
// TODO : Make user slice to  use adavance rtk query for better optimizations
const Layout = () => {
  return (
    <>
      <Header />
      <main className="App">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
