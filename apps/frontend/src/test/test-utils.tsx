import { render } from "@testing-library/react";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "@/routeTree.gen";

const queryClient = new QueryClient();

export function renderWithProviders(ui: React.ReactElement, { route = "/" } = {}) {
  const memoryHistory = createMemoryHistory({ initialEntries: [route] });

  const router = createRouter({
    routeTree,
    history: memoryHistory,
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}