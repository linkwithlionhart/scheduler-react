import React from "react";
import Application from "components/Application";
import {
  fireEvent,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  getByText,
  prettyDOM,
  queryByText,
  render,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";



describe("Application", () => {
  
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
  
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

});

