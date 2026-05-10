import { fetchSubjects } from "./app/hooks/useSubjects.ts";
async function run() {
  const res = await fetchSubjects("radical", 1, 100, 31, 40);
  console.log("Level type:", typeof res.data[0]?.Level);
}
run();
