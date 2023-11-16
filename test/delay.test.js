/** 
 * Disabled for now, until combined with the merge branch
 * which introduces Jest and a new test suite layout

import { calculateDelay } from "../src/state-machines/SayPiMachine";

// Mock Date.getTime()
const mockCurrentTime = 1600000000000; // Some fixed timestamp
jest.spyOn(global.Date, "getTime").mockImplementation(() => mockCurrentTime);

describe("calculateDelay", () => {
  const maxDelay = 10000; // 10 seconds in milliseconds

  // Test scenario where the user has just finished speaking
  test("should return maximum delay when tempo is 0 and probabilityFinished is 1", () => {
    const delay = calculateDelay(mockCurrentTime, 1, 0, maxDelay);
    expect(delay).toEqual(maxDelay);
  });

  // Test scenario where the user is a fast speaker
  test("should return 0 delay for very fast speech regardless of probabilityFinished", () => {
    const delay = calculateDelay(mockCurrentTime, 0.5, 1, maxDelay);
    expect(delay).toEqual(0);
  });

  // Test scenario where the user is a slow speaker
  test("should return delay proportional to probabilityFinished for slow speech", () => {
    const probabilityFinished = 0.7;
    const delay = calculateDelay(
      mockCurrentTime,
      probabilityFinished,
      0,
      maxDelay
    );
    expect(delay).toEqual(probabilityFinished * maxDelay);
  });

  // Test scenario where some time has already elapsed since the user stopped speaking
  test("should subtract elapsed time from the initial delay", () => {
    const timeUserStoppedSpeaking = mockCurrentTime - 5000; // 5 seconds ago
    const delay = calculateDelay(timeUserStoppedSpeaking, 1, 0.5, maxDelay);
    expect(delay).toEqual(5000); // 5 seconds remaining of the maxDelay
  });

  // Test scenario with average tempo and high probabilityFinished
  test("should return half maxDelay for average tempo and high probabilityFinished", () => {
    const delay = calculateDelay(mockCurrentTime, 0.9, 0.5, maxDelay);
    expect(delay).toEqual(maxDelay / 2);
  });

  // Add more test cases as needed to cover different combinations of parameters
});

// Restore the original implementation
afterAll(() => {
  jest.restoreAllMocks();
});
 */
