import { getDownloadURL, uploadBytes } from "firebase/storage";

export const uploadToStorage = async ({
  name,
  file,
}: {
  name: string;
  file?: File;
}) => {
  try {
    if (name !== "" && file) {
      const bytes = (await getBytesArray(file)) as ArrayBuffer;
      const snapshot = await uploadBytes(getRef(name), bytes);
      const FinaleImagePath = await getDownloadURL(snapshot.ref);
      return FinaleImagePath;
    }
    return "";
  } catch (error) {
    throw error;
    return "";
  }
};

const getBytesArray = (file: File) => {
  const fileData = new Blob([file]);
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = () => {
      let arrayBuffer = new Uint8Array(reader.result as ArrayBuffer);
      resolve(arrayBuffer);
    };
  });
};
