import { AssistantT, newAssistantT, updateAssistantT } from "~~/types";

export default function () {
  const client = useSupabaseClient();

  const Assistants = useState<AssistantT[]>(() => []);

  const AssistantFeilds = ["firstname", "lastname", "phone", "email"] as const;

  const AssistantPlaceHolders = [
    "Firstname",
    "Lastname",
    "Phone",
    "Email",
  ] as const;

  onBeforeMount(() => getAllAssistants());

  const getAllAssistants = async () => {
    if (!Assistants.value.length) return;
    try {
      const { data, error } = await client
        .from("assistants")
        .select("*")
        .order("id", {
          ascending: false,
        });
      if (!error) {
        Assistants.value = data as AssistantT[];
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const createAssistant = async (Assistant: newAssistantT) => {
    const { image, firstname, lastname } = Assistant;
    try {
      const imagePath = await uploadToStorage({
        name: firstname.concat(lastname),
        file: image,
      });
      // create new assisitant using supabase
      const { data, error } = await client
        .from("assistants")
        .insert([
          {
            ...Assistant,
            image: imagePath,
            fullname: firstname + " " + lastname,
          } as never,
        ])
        .select();
      if (!error) {
        Assistants.value.unshift(data[0]);
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAssistant = async (id: number) => {
    try {
      const { error } = await client.from("assistants").delete().eq("id", id);
      if (!error) {
        Assistants.value = Assistants.value.filter(
          (ass: AssistantT) => ass.id !== id
        );
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const updateAssistant = async (Assistant: updateAssistantT, id: number) => {
    try {
      const { data, error } = await client
        .from("assistants")
        .update(Assistant as never)
        .eq("id", id)
        .select();

      if (!error) {
        Assistants.value = Assistants.value.map((ass: AssistantT) =>
          ass.id === id ? data[0] : ass
        );
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createAssistant,
    deleteAssistant,
    updateAssistant,
    Assistants,
    AssistantFeilds,
    AssistantPlaceHolders,
  };
}
