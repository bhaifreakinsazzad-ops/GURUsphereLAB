/** Tiny localStorage prefs for the safe topic leaderboard. */
const KEY = "gs_lb_optout_v1";

export function isOptedOut(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setOptedOut(v: boolean) {
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
}
