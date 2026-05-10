import { fetchSubjects } from "./app/hooks/useSubjects.ts";
async function run() {
  const res = await fetchSubjects("radical", 1, 10, 31, 40);
  console.log("Levels:", res.data.map(d => d.Level));
}
run();
