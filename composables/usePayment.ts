import { AffiliationT, SalaryT, newAffiliationT, newSalaryT } from "~~/types";

export default function () {
  const client = useSupabaseClient();
  const Affiliations = useState<AffiliationT[]>(() => []);
  const Salaries = useState<SalaryT[]>(() => []);

  onBeforeMount(() => {
    getAllAffiliations();
    getAllSalaries();
  });

  type joins = {
    students: any;
    groups: any;
    months: any;
  };

  const getAllAffiliations = async () => {
    try {
      const { data, error } = await client
        .from("affiliations")
        .select("*, students (fullname), groups (name),months (name)")
        .order("id", {
          ascending: false,
        });
      if (!error) {
        Affiliations.value = data.map((aff: AffiliationT & joins) => ({
          ...aff,
          studentName: aff.students.fullname,
          groupName: aff.groups.name,
          month: aff.months.name,
        })) as AffiliationT[];
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllSalaries = async () => {
    try {
      const { data, error } = await client
        .from("salaries")
        .select("*, teachers (fullname), groups (name),months (name)")
        .order("id", {
          ascending: false,
        });
      if (!error) {
        Salaries.value = data.map((sal: any) => ({
          ...sal,
          fullname: sal.teachers.fullname,
          group: sal.groups.name,
          month: sal.months.name,
        })) as SalaryT[];
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const createAffiliation = async (aff: newAffiliationT) => {
    try {
      // array we will send to supabase
      let tobeInserted: {
        studentid: number;
        amount: number;
        groupid: number;
        monthid: number;
        date: string;
      }[] = [];
      // get data we need for each record
      const { months, amount, studentid } = aff;
      // get current date
      const date = new Date().toLocaleDateString("fr-fr", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
      // split amount on months
      const EachMonthPayment = amount / months.length;
      // populate the tobeibserted array with records
      for (let i = 0; i < months.length; i++) {
        tobeInserted.push({
          amount: EachMonthPayment,
          groupid: aff.group,
          monthid: months[i],
          studentid,
          date,
        });
      }
      // send to supa and return the newly created records
      const { data, error } = await client
        .from("affiliations")
        .insert(tobeInserted as never[])
        .select("*, groups (name), months (name), students (fullname)");

      //  if theres no error add newly created records to aff state
      if (!error) {
        Affiliations.value.unshift(
          ...(data.map((aff: AffiliationT & joins) => ({
            ...aff,
            studentName: aff.students.fullname,
            groupName: aff.groups.name,
            month: aff.months.name,
          })) as AffiliationT[])
        );
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const createSalary = async (salary: newSalaryT) => {
    try {
      const date = new Date().toLocaleDateString("fr-fr", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
      const { data, error } = await client
        .from("salaries")
        .insert({
          ...salary,
          date,
        } as never)
        .select("*, teachers (fullname), groups (name), months (name)");
      if (!error) {
        Salaries.value.unshift(
          data.map((sal: any) => ({
            ...sal,
            fullname: sal.teachers.fullname,
            group: sal.groups.name,
            month: sal.months.name,
          }))[0] as SalaryT
        );
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAffiliation = async (id: number) => {
    try {
      const { error } = await client.from("affiliations").delete().eq("id", id);
      if (!error) {
        Affiliations.value = Affiliations.value.filter(
          (aff: AffiliationT) => aff.id !== id
        );
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSalary = async (id: number) => {
    try {
      const { error } = await client.from("salaries").delete().eq("id", id);
      if (!error) {
        Salaries.value = Salaries.value.filter((sal: SalaryT) => sal.id !== id);
        return;
      }
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createAffiliation,
    deleteAffiliation,
    deleteSalary,
    createSalary,
    Affiliations,
    Salaries,
  };
}
