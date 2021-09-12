export function parseDateForDiscord(dateToBeConverted) {
  const mydataSucess = parseInt(
    (new Date(dateToBeConverted).getTime() / 1000).toFixed(0),
    10
  );
  return `<t:${mydataSucess}:F>`;
}
