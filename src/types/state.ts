import { User } from "./user";

export interface State {
    user: UserState
}

export interface UserState {
    value?: User | null
    serverValue?: any | null
}