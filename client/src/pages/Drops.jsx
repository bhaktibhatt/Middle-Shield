import { useEffect, useState } from "react";

export default function Drops() {
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/drops")
      .then((res) => res.json())
      .then(setDrops)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Recent Drop Logs</h2>
      <pre>{JSON.stringify(drops, null, 2)}</pre>
    </div>
  );
}
