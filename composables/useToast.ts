export default function () {
  const showtoast = useState<boolean>(() => false);

  const toast = useState<{ text: string; role: string }>();

  const toggleToast = async (tst: { text: string; role: string }) => {
    toast.value = tst;
    showtoast.value = true;
    await sleepFor(3300);
    showtoast.value = false;
  };

  return {
    toast,
    showtoast,
    toggleToast,
  };
}
