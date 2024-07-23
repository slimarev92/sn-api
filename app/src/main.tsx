import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/app/App";

import "./styles/style.scss";
import { QueryClientProvider } from "@tanstack/react-query";
import { SelectedFeedsService } from "./components/feeds/feeds-context";
import { queryClient } from "./utils/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <SelectedFeedsService>
                <App />
            </SelectedFeedsService>
        </React.StrictMode>
    </QueryClientProvider>,
);
