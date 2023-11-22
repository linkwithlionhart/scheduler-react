import React from "react";
import Application from "components/Application";
import {
  fireEvent,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  getByText,
  prettyDOM,
  queryByRole,
  queryByAltText,
  queryByText,
  render,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";

describe("Application", () => {
  
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the sports remaining for the first day by 1", async() => {
    const { container, debug } = render(<Application />);
    
    // Wait for initial data to load.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // Find the first appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // Click the "Add" button to create a new appointment.
    fireEvent.click(getByAltText(appointment, "Add"));

    // Enter the student name.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value : "Lydia Miller-Jones"}
    });

    // Select an interviewer.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // Click the "Save" button.
    fireEvent.click(getByText(appointment, "Save"));
  
    // console.log(prettyDOM(container));
    // console.log(prettyDOM(appointments)); 
    // console.log(prettyDOM(appointment));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // expect(getByText(appointment, "Saving")).not.toBeInTheDocument();

    // Wait for the "Saving" status to be removed.
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    
    // Wait for the student's name to be displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // Find the day node that contains the text "Monday".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    // Check the day has the text "no spots remaining".
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });
  
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
  
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
  
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
  
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
  
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview, and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Edit"));
  
    // 4. Change the student name or interviewer.
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Updated Student Name" }
    });
  
    // 5. Check that the "Saving" status is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    // 6. Wait until the "Saving" status is removed.
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
  
    // 7. Wait until the updated student name is displayed.
    await waitForElement(() => getByText(appointment, "Updated Student Name"));
  
    // 8. Check that the DayListItem with the text "Monday" has the same spots remaining.
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    // Modify the following line based on your actual spots remaining text for Monday.
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });  

});

