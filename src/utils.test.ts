import { utils } from "./utils";

describe("compareVersion", () => {
    test("1.0.0 less than 1.0.1", () => {
        expect(utils.compareVersion("1.0.0", "1.0.1")).toBe(true);
    });

    test("9.9.9 less than 10.9.9", () => {
        expect(utils.compareVersion("9.9.9", "10.9.9")).toBe(true);
    });

    test("0.0.0 less than 0.1.0", () => {
        expect(utils.compareVersion("0.0.0", "0.1.0")).toBe(true);
    });

    test("10.1.7 not less than 11.0.4", () => {
        expect(utils.compareVersion("10.1.7", "11.0.4")).toBe(false);
    });

    test("1.0.0 not less than 0.9.9", () => {
        expect(utils.compareVersion("1.0.0", "0.9.9")).toBe(false);
    });

    test("1.0.0 not less than 1.0.0", () => {
        expect(utils.compareVersion("1.0.0", "1.0.0")).toBe(false);
    });

    test("1.0.0 not less than 0.0.0", () => {
        expect(utils.compareVersion("1.0.0", "0.0.0")).toBe(false);
    });
});
