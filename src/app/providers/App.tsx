import { BrowserRouter } from "react-router-dom";
import { RouterProvider } from "./RouterProvider";
import { Notifications } from "@mantine/notifications";

import { HelmetProvider } from "./HelmetProvider";

import "@/app/styles/index.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { Web3ModalProvider } from "./Web3ModalProvider";
import { TransactionCheckerProvider } from "./TransactionCheckerProvider";

export const App = () => {
  return (
    <HelmetProvider>
      <Web3ModalProvider>
        <ReactQueryProvider>
          <MantineProvider>
            <BrowserRouter>
              <TransactionCheckerProvider>
                <RouterProvider />
                <Notifications position="top-right" zIndex={9999} />
              </TransactionCheckerProvider>
            </BrowserRouter>
          </MantineProvider>
        </ReactQueryProvider>
      </Web3ModalProvider>
    </HelmetProvider>
  );
};
