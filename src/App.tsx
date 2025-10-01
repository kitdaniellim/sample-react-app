import React from "react";
import "./App.css";
// import News from "./components/News";
import FormToCSV from "./components/FormToCSV";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fill up the form!</h1>

        <FormToCSV />

        {/* <News /> */}
      </header>
    </div>
  );
}

export default App;
