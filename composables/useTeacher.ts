import { TeacherT, newTeacherT, updateTeacherT } from "~~/types";

export default function () {
  const client = useSupabaseClient();

  const Teachers = useState<TeacherT[]>(() => []);
  const Teacher = useState<TeacherT | null>(() => null);

  const TeacherFeilds = ["firstname", "lastname", "phone", "email"] as const;

  const TeacherPlaceHolders = [
    "Firstname",
    "Lastname",
    "Phone",
    "Email",
  ] as const;

  onBeforeMount(() => getAllTeachers());

  const getAllTeachers = async () => {
    try {
      const { data, error } = await client
        .from("teachers")
        .select("*")
        .order("id", {
          ascending: false,
        });
      if (!error) {
        Teachers.value = data as TeacherT[];
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const createTeacher = async (Teacher: newTeacherT) => {
    const { image, firstname, lastname } = Teacher;
    try {
      const imagePath = await uploadToStorage({
        name: firstname.concat(lastname),
        file: image,
      });
      const { data, error } = await client
        .from("teachers")
        .insert({
          ...Teacher,
          image: imagePath,
          fullname: firstname.concat(" ").concat(lastname),
        } as never)
        .select();
      if (!error) {
        Teachers.value.unshift(data[0] as TeacherT);
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTeacher = async (id: number) => {
    try {
      const { error } = await client.from("teachers").delete().eq("id", id);
      if (!error) {
        Teachers.value = Teachers.value.filter((te: TeacherT) => te.id !== id);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTeacher = async (Teacher: updateTeacherT, id: number) => {
    try {
      const { data, error } = await client
        .from("teachers")
        .update(Teacher as never)
        .eq("id", id)
        .select();

      if (!error) {
        Teachers.value = Teachers.value.map((teacher: TeacherT) =>
          teacher.id === id ? data[0] : teacher
        );
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const getTeacherById = async (id: number) => {
    try {
      Teacher.value =
        Teachers.value.find((st: TeacherT) => st.id === id) ?? null;
      if (Teacher.value) {
        return;
      }
      const { data, error } = await client
        .from("teachers")
        .select()
        .eq("id", id);

      if (!error) {
        Teacher.value = data[0] as TeacherT;
        return;
      }

      console.log(error);
    } catch (error) {}
  };

  const getTeacherPayments = async (month: number, groupId: number) => {
    try {
      const { data, error } = await client
        .from("affiliations")
        .select("*")
        .eq("monthid", month)
        .eq("groupid", groupId);

      return { data, error };
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  };
  return {
    TeacherPlaceHolders,
    getTeacherPayments,
    getAllTeachers,
    TeacherFeilds,
    createTeacher,
    deleteTeacher,
    updateTeacher,
    getTeacherById,
    Teachers,
    Teacher,
  };
}
