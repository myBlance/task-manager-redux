import axios from "axios";

const UPLOADCARE_PUBLIC_KEY = process.env.REACT_APP_UPLOADCARE_PUBLIC_KEY || "";
const UPLOADCARE_SECRET_KEY = "df4288ce67f60455fa78";

const fetchFiles = async () => {
    const response = await axios.get("https://api.uploadcare.com/files/", {
        headers: {
            Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        },
    });

    return response.data?.results?.map((item: any) => ({
        id: new Date(item.datetime_uploaded).getTime(),
        name: item.original_filename,
        size: item.size,
        type: item.mime_type,
        url: `https://ucarecdn.com/${item.uuid}/`,
    })) || [];
};

const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
    formData.append("UPLOADCARE_STORE", "1");
    formData.append("file", file);

    const response = await axios.post("https://upload.uploadcare.com/base/", formData);
    const fileUUID = response.data.file;

    return {
        id: new Date().getTime(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: `https://ucarecdn.com/${fileUUID}/`,
    };
};

const deleteFile = async (fileUrl: string) => {
    const fileUUID = fileUrl.split("/").slice(-2, -1)[0];
    await axios.delete(`https://api.uploadcare.com/files/${fileUUID}/`, {
        headers: {
            Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
        },
    });
};

export default {
    fetchFiles,
    uploadFile,
    deleteFile,
};
