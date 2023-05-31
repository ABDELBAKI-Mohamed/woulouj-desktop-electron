export default function () {
  const showmodal = useState<boolean>(() => false);
  const whichname = useState<string>(() => "createGroup");
  const deleteTitle = useState<string>();
  const rowId = useState<number>();
  const row = useState<any>(() => {});

  const deleteFunction = useState<(id: number) => void>(() => () => "");

  const defineFunction = (cb: (id: number) => Promise<void>) =>
    (deleteFunction.value = cb);

  const toggleModal = (
    value: boolean,
    name: string = "",
    title: string = ""
  ) => {
    showmodal.value = value;
    whichname.value = name;
    deleteTitle.value = title;
  };

  return {
    row,
    rowId,
    showmodal,
    whichname,
    toggleModal,
    deleteTitle,
    deleteFunction,
    defineFunction,
  };
}
