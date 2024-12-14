const apiUrl = import.meta.env.VITE_API_URL;

export const getHealth = async () => {
    return await (await fetch(`${apiUrl}/health`)).json();
};