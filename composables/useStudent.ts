import { StudentT, newStudentT, updateStudentT } from "~~/types";

export default function () {
  const client = useSupabaseClient();

  const Students = useState<StudentT[]>(() => []);
  const Student = useState<StudentT>();

  const StudentFeilds = [
    "firstname",
    "lastname",
    "phone",
    "addresse",
    "email",
  ] as const;

  const StudentPlaceHolders = [
    "Firstname",
    "Lastname",
    "Phone",
    "Addresse",
    "Email",
  ] as const;

  onBeforeMount(() => {
    getAllStudents();
  });

  type withGroups = {
    groups: {
      name: string;
    };
  };

  const getAllStudents = async () => {
    try {
      const { data, error } = await client
        .from("students")
        // .select("*,groups (name)")
        .select("*")
        .order("id", {
          ascending: false,
        });
      if (!error) {
        // Students.value = data.map((student: StudentT & withGroups) => ({
        //   ...student,
        //   groupName: student.groups.name,
        // })) as StudentT[];
        Students.value = data as StudentT[];
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  // JUST IN CASE U WANNA RETURN GROUPID TO STUDENT
  // DONT FORGET TO ADD IT IN DB

  const createStudent = async (student: newStudentT) => {
    const { image, firstname, lastname } = student;
    try {
      const imagePath = await uploadToStorage({
        name: firstname.concat(lastname),
        file: image,
      });
      const { data, error } = await client
        .from("students")
        .insert({
          ...student,
          image: imagePath,
          fullname: firstname.concat(" ").concat(lastname),
        } as never)
        .select();
      if (!error) {
        Students.value.unshift(data[0]);
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const { error } = await client.from("students").delete().eq("id", id);
      if (!error) {
        Students.value = Students.value.filter((st: StudentT) => st.id !== id);
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStudent = async (student: updateStudentT, id: number) => {
    try {
      const { data, error } = await client
        .from("students")
        .update(student as never)
        .eq("id", id)
        .select();

      if (!error) {
        Students.value.map((student: StudentT) =>
          student.id === id ? data[0] : student
        );
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getAllStudents,
    createStudent,
    deleteStudent,
    updateStudent,
    Students,
    Student,
    StudentFeilds,
    StudentPlaceHolders,
  };
}
