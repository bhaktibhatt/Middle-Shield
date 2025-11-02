import { useEffect, useState } from "react";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/logs")
      .then((res) => res.json())
      .then(setLogs)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Recent Logs</h2>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}
