import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/app/App";

import "./styles/style.scss";
import UsersService from "./components/users/UsersService";
import { FeedsService } from "./components/feeds/FeedsService";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <FeedsService>
            <UsersService>
                <App />
            </UsersService>
        </FeedsService>
    </React.StrictMode>,
);
