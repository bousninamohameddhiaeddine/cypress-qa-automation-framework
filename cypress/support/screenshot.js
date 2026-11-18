// Nom des captures : "<titre du test> - <STATUT> - AAAA-MM-JJ_HH-MM-SS"
export const screenshotName = (title, status) => {
  const name = title.replace(/[\\/:*?"<>|]/g, "-");
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  return `${name} - ${status} - ${stamp}`;
};
