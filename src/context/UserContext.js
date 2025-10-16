import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) setUserData(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to load userData:", err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!!userData) {
      AsyncStorage.setItem('userData', JSON.stringify(userData))
        .catch(err => console.error("Failed to save userData:", err));
    } else {
      AsyncStorage.removeItem('userData')
        .catch(err => console.error("Failed to clear userData:", err));
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
