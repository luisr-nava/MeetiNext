import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteUTPFiles = async (file: string) => {
  try {
    const key = file.split('/f/')[1]
    await utapi.deleteFiles(key)
  } catch (error) {
    console.error("UTApi: Error eliminando el archivo ", error);
  }
};


// https://pc4lr8h8pn.ufs.sh/f/K8RKoNGvUgA3erhv8j7FEfK9ZMtebGwmC7hc1R0kX5nozSlT