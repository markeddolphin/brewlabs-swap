const ARCHIVED_FARMS_START_PID = 139;
const ARCHIVED_FARMS_END_PID = 250;

const isArchivedPid = (pid: number) => pid >= ARCHIVED_FARMS_START_PID && pid <= ARCHIVED_FARMS_END_PID;

export function getLpAprsFromLocalStorage(): any {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("pcs_lpAprs");
    if (data) return JSON.parse(data);
    return data;
  }
}
export default isArchivedPid;
