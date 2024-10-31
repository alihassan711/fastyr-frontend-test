import React from "react";
import Container from "../components/Layout/Container";
import SidebarContainer from "../components/Layout/SidebarContainer";
import ContentContainer from "../components/Layout/ContentContainer";
import MainContainer from "../components/Layout/MainContainer";
import { Provider } from "../lib/ApolloProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

export const metadata = {
  title: "Fastyr Frontend Test",
  description: "A layout for the Fastyr frontend test project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Container>
          <SidebarContainer />
          <ContentContainer>
            <MainContainer>
              <Provider>{children}</Provider>
            </MainContainer>
          </ContentContainer>
        </Container>
        <ToastContainer 
          position="top-right"
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}
