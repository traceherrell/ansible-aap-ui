import React from "react";

const NotificationContext = React.createContext({
  notifications: [],
  removeLastNotification: () => {},
  addNotification: () => {},
});

const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = React.useState([]);
    
    const removeLastNotification = () => {
        setNotifications((prev) => prev.slice(1));
    };
    
    const addNotification = (message) => {
        setNotifications((prev) => [...prev, { ...message, key: new Date().getTime() }]);
    };
    
    return (
        <NotificationContext.Provider value={{ notifications, removeLastNotification, addNotification }}>
        {children}
        </NotificationContext.Provider>
    );
}

export  { NotificationContext, NotificationProvider };
