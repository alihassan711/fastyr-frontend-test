import React from "react";
import Header from "../Header/Header";

function ContentContainer({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}

export default ContentContainer;
