import { GroupT, TeacherT, newGroupT, updateGroupT } from "~~/types";

export default function () {
  const client = useSupabaseClient();

  const Groups = useState<GroupT[]>(() => []);
  const Group = useState<GroupT>();

  const GroupFeilds = [
    "name",
    "teachername",
    "languagename",
    "levelname",
    "modulename",
    "agename",
  ] as const;

  onBeforeMount(() => getAllGroups());

  const getAllGroups = async () => {
    if (Groups.value.length) return;
    try {
      const { data, error } = await client
        .from("groups")
        .select("*,teachers (fullname)")
        .order("id", {
          ascending: false,
        });
      if (!error) {
        Groups.value = data.map((gr: GroupT & { teachers: any }) => ({
          ...gr,
          teachername: gr.teachers.fullname,
        })) as GroupT[];
        console.log(Groups.value);
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const createGroup = async (Group: newGroupT) => {
    try {
      const { data, error } = await client
        .from("groups")
        .insert([Group as never])
        .select("*, teachers (fullname)");

      if (!error) {
        Groups.value.unshift(
          ...(data.map((gr: GroupT & { teachers: any }) => ({
            ...gr,
            teachername: gr.teachers.fullname,
          })) as GroupT[])
        );
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const { error } = await client.from("groups").delete().eq("id", id);
      if (!error) {
        Groups.value = Groups.value.filter((gr: GroupT) => gr.id !== id);
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const updateGroup = async (Group: updateGroupT, id: number) => {
    try {
      const { data, error } = await client
        .from("groups")
        .update(Group as never)
        .eq("id", id)
        .select();

      if (!error) {
        Groups.value = Groups.value.map((gr: GroupT) =>
          gr.id === id ? data[0] : gr
        );
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createGroup,
    deleteGroup,
    updateGroup,
    GroupFeilds,
    getAllGroups,
    Groups,
    Group,
  };
}
