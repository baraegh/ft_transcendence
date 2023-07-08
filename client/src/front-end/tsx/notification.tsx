import React, { useState, useEffect } from 'react';
import '../css/notification.css'; // CSS file for styling the notification
import me from '../img/rimney.jpeg'
const Notification = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 30000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showNotification]);

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      {showNotification && (
        <div className="slide-in-modal">
          <div className="content">
            <span className="message">rimney has sent you a friend request</span>

            <img id="profileImgNotif" src={me} alt="" />
          </div>
          <div className='notifButons'>
          <a onClick={() => {console.log("Accept Button")}}>Accept</a>
          <a onClick={() => {closeNotification()}}>Reject</a>
        </div>
        </div>
      )}
      <button onClick={() => setShowNotification(true)}>Show Notification</button>
    </>
  );
};

export default Notification;
