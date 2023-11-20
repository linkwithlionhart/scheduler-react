import { useState } from "react";

export default function useVisualMode(initial) {
  // const [ mode, setMode ] = useState(initial);
  const [ history, setHistory ] = useState([initial]);
  
  function transition(newMode, replace = false) {
    // setMode(newMode);
    setHistory(prev => (replace ? [...prev.slice(0, prev.length - 1), newMode] : [...prev, newMode]));
  }

  function back() {
    // setMode(history[history.length -1]);
    setHistory(prev => (prev.length > 1 ? [...prev.slice(0, prev.length - 1)] : prev));
  }
  
  return { mode: history[history.length -1], transition, back };
}