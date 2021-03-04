import axios from 'axios';
import { useStore } from '../hooks/hooks';

//TODO
export const CreateApi = () => {
    const authStore = useStore('authStore');

    const instance = axios.create({
        withCredentials: true,
        baseURL: '/api/',
        headers: {
            authorization: authStore.token,
        },
    });

    return instance;
};

export const tasksAPI = {
    getTasks(): Promise<any> {
        console.log('GET TASKS: ', CreateApi());
        return CreateApi()
            .get(`task`)
            .then((response) => response.data);
    },
    deleteItem(itemId: string): Promise<any> {
        return CreateApi().delete(`task/${itemId}`);
    },
    getItem(itemId: string): Promise<any> {
        return CreateApi()
            .get(`task/${itemId}`)
            .then((response) => response.data);
    },
};
