import React, { createContext, useState } from "react";

// Create the context
export const MyContext = createContext(undefined);

// Create a provider component
const MyProvider = ({ children }) => {
  const [capsuleInfo, setCapsuleInfo] = useState({
    title: "",
    description: "",
    unlockDate: "",
    capsuleType: "",
    fileUri: "",
  });
  const [token, setToken] = useState("");
  const [state, setState] = useState("1");

  return (
<MyContext.Provider value={{ state, setState, capsuleInfo, setCapsuleInfo, token, setToken }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
