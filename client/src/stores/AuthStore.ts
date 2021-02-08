import { action, observable } from 'mobx';

export class AuthStore {
    @observable
    token = '';

    @observable
    isAuth = true;

    @action
    setToken(token: string): void {
        this.token = token;
    }

    @action
    setIsAuth(isAuth: boolean): void {
        this.isAuth = isAuth;
    }
}
