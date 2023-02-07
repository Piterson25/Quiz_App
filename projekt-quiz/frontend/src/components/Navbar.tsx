import * as React from "react";
import { Link } from 'react-router-dom';
import "../styles/index.scss";

const Navbar: React.FC = () => {

  return (
    <header>
      <Link to="/" className="text-white hover:text-gray-300">
        Quiz App
      </Link>
    </header>
  );
};

export default Navbar;