import React from "react";
import "./App.css";
import News from "./components/News";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hacker News</h1>
        <News />
      </header>
    </div>
  );
}

export default App;
