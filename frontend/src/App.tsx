import { useState } from "react";
import "./App.css";
import { QuestionnaireView } from "./view/QuestionnaireView";
import { QuestionnaireResponseView } from "./view/QuestionnaireResponseView";
import { Route, Routes } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<QuestionnaireView />} />
        <Route path="/responses" element={<QuestionnaireResponseView />} />
      </Routes>
    </div>
  );
}

export default App;
