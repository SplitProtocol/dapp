import { BrowserRouter } from "react-router-dom";
import { RouterProvider } from "./RouterProvider";

import { HelmetProvider } from "./HelmetProvider";

import "@/app/styles/index.css";
import { MantineProvider } from "@mantine/core";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { Web3ModalProvider } from "./Web3ModalProvider";

export const App = () => {
  return (
    <HelmetProvider>
      <Web3ModalProvider>
        <ReactQueryProvider>
          <MantineProvider>
            <BrowserRouter>
              <RouterProvider />
            </BrowserRouter>
          </MantineProvider>
        </ReactQueryProvider>
      </Web3ModalProvider>
    </HelmetProvider>
  );
};
