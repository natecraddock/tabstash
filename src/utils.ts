export namespace utils {
    /**
     * Returns true when userVersion is less than appVersion.
     * @param userVersion a string of the form x.y.z
     * @param appVersion a string of the form x.y.z
     */
    export function compareVersion(userVersion: string, appVersion: string): boolean {
        if (userVersion === appVersion) {
            return false;
        }

        let userVersionNums = userVersion.split(".").map((value) => Number(value));
        let appVersionNums = appVersion.split(".").map((value) => Number(value));

        for (let i = 0; i < 3; ++i) {
            if (userVersionNums[i] > appVersionNums[i]) {
                return false;
            }
        }

        return true;
    }
}
