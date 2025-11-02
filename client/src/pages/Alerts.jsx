import { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/alerts")
      .then((res) => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Recent Alerts</h2>
      <pre>{JSON.stringify(alerts, null, 2)}</pre>
    </div>
  );
}
