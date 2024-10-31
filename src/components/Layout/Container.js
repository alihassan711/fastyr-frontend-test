import React from "react";

const Container = ({ children }) => {
  return (
    <div className="flex flex-row w-full">
      {children}
    </div>
  );
};

export default Container;