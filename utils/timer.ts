export function getCurrentTime() {
  const now = new Date();     //gets the current date and time from the system
  console.log(now.toLocaleString());    //converts to readable format
  const time = now.toLocaleTimeString().split(':');
 return time;
}
