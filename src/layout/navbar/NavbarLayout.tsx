import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";

type NavbarProviderState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const initialValue: NavbarProviderState = {
  isOpen: true,
  setIsOpen: () => {},
};

const NavbarProviderContext = createContext<NavbarProviderState>(initialValue);

const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <NavbarProviderContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </NavbarProviderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNavbar = () => {
  const context = useContext(NavbarProviderContext);

  if (context === undefined)
    throw new Error("useNavbar must be used within a NavbarProvider");

  return context;
};

const NavbarLayout = () => {
  return (
    <NavbarProvider>
      <Outlet />
    </NavbarProvider>
  );
};

export default NavbarLayout;
