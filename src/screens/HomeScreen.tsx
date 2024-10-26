import React from "react";
import { Link } from "react-router-dom";

const HomeScreen: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/bangtheduelgenerator">
              Go to Bang The Duel Generator.
            </Link>
          </li>

          <li>
            <Link to="/loveyoupage">
              Go to I love you page.
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomeScreen;
