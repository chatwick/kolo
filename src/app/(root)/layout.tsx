"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

// Main layout component that defined all the layout for the app
// It uses the query client provider to provide the query client to the app
// All subcomponents will have access to the query client for making requests
const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const queryClient = new QueryClient();

  // return the main layout with the query client provider and react query
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        {<ReactQueryDevtools initialIsOpen={false} />}
        <div>{children}</div>
        <Toaster />
      </QueryClientProvider>
    </main>
  );
};

export default MainLayout;
