export function getCurrentTime() {
  const now = new Date();
  console.log(now.toLocaleString());
  const time = now.toLocaleTimeString().split(':');
 return time;
}
