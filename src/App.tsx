import imag from "./assets/preview.png";
import "./App.css";
import { data } from "./shared/data";
import { Card } from "./components/card";
import { useRef, useState } from "react";

function App() {
  /*
  Data Required.
  image 
  video 
  title image
  title text
  variable 89% match
  variable U/A 16+
  variable no. of episodes
  tags: Rousing . adventure . striking
  */

  const timeoutRef = useRef(0);
  const [muted, setMuted] = useState(true);
  const toggleMute = () => {
    setMuted(!muted);
  };
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <p className="text-xl">
          Welcome to your Vite + React + Tailwind CSS template
        </p>

        <div className="my-10 flex gap-1 px-1 py-56 overflow-visible overflow-x-auto">
          {data.map((item) => (
            <Card
              toggleMute={toggleMute}
              muted={muted}
              key={item.actionURL + muted}
              timeoutRef={timeoutRef}
              item={item}
            />
          ))}
        </div>

        <div className="flex">
          <img src={imag} width={400} />
          <div></div>
        </div>
      </div>
    </>
  );
}

export default App;
