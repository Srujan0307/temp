import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/test/test-utils";
import { Route } from "../calendar";

vi.mock("@/features/calendar", () => ({
  Calendar: () => <div data-testid="calendar" />,
  CalendarFilterPanel: () => <div>Filters</div>,
  EventDetailDrawer: () => null,
  CreateEventModal: () => null,
}));

describe("CalendarPage", () => {
  it("renders the calendar page with the main components", () => {
    renderWithProviders(<Route.component />, { route: "/calendar" });

    // Check for the main heading
    expect(
      screen.getByRole("heading", { name: /calendar/i })
    ).toBeInTheDocument();

    // Check for the "Create Event" button
    expect(
      screen.getByRole("button", { name: /create event/i })
    ).toBeInTheDocument();

    // Check for the filter panel
    expect(screen.getByText(/filters/i)).toBeInTheDocument();

    // Check for the calendar component
    expect(screen.getByTestId("calendar")).toBeInTheDocument();
  });
});