import React, { createContext, useState, useContext, useEffect } from "react";

const DeadlineContext = createContext();

export const DeadlineProvider = ({ children }) => {
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/deadline");
        if (response.ok) {
          const data = await response.json();
          setDeadline(new Date(data.deadline));
        }
      } catch (error) {
        console.error("Error fetching deadline:", error);
      }
    };

    fetchDeadline();
  }, []);

  return (
    <DeadlineContext.Provider value={{ deadline, setDeadline }}>
      {children}
    </DeadlineContext.Provider>
  );
};

export const useDeadline = () => useContext(DeadlineContext);
