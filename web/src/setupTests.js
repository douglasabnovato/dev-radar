/*
 * setupTests.js · matchers do jest-dom e filtro do aviso de depreciação do act (Testing Library 13 + React 18.3).
 */
import "@testing-library/jest-dom";

const originalError = console.error;

/* Silencia só o aviso conhecido da biblioteca. */
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message, ...args) => {
    if (typeof message === "string" && message.includes("ReactDOMTestUtils.act")) return;
    originalError(message, ...args);
  });
});

/* Restaura o console. */
afterAll(() => console.error.mockRestore());
/* fim de setupTests.js */
