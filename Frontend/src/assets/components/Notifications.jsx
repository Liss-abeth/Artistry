import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {  // ✅ Function component starts here
  const [notifications, setNotifications] = useState([]); // ✅ Now inside component
  const userId = "67bf73a6a33a952f9f1af892"; // Replace with actual user ID

  useEffect(() => {
    axios.get(`/notifications/${userId}`) // ✅ Use userId in request
      .then((res) => {
        console.log("Fetched Notifications:", res.data);
        setNotifications(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Error fetching notifications:", err.response?.data || err.message));
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notif) => (
            <li key={notif._id}>{notif.message}</li>
          ))}
        </ul>
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default Notifications;  // ✅ Ensure export name matches component name
