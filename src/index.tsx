import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { store } from "./app/store";
import App from "./App";
import "./index.css";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
const persistor = persistStore(store);

root.render(
  <React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={<div>Đang tải dữ liệu...</div>} persistor={persistor}>
          <App />
        </PersistGate>
    </Provider>
  </React.StrictMode>
);
