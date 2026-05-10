import { fetchSubjects } from "./app/hooks/useSubjects.ts";
async function run() {
  const result = await fetchSubjects("radical", 1, 100, 31, 40);
  const subjects = result.data;
  const selectedRanges = [[31, 40]];
  const filteredSubjects = subjects.filter(subject => {
    if (selectedRanges.length > 0) {
      const matchesLevel = selectedRanges.some(r => subject.Level !== undefined && subject.Level >= r[0] && subject.Level <= r[1]);
      if (!matchesLevel) return false;
    }
    return true;
  });
  console.log("Subjects:", subjects.length);
  console.log("Filtered:", filteredSubjects.length);
  if (filteredSubjects.length === 0) {
    console.log("First subject:", subjects[0]);
  }
}
run();
