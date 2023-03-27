import React from "react";
import { Route, Routes } from "react-router-dom";
import Stream from "./Stream";

export default function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Stream />} />
      </Routes>
    </React.Fragment>
  );
}
