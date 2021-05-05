import { Subject } from '../settings/subject';
export class User {
    id: string;
    _id: string;
    username: string;
    password: string;
    role: string;
    token: string;
    subjects: Subject[];
    classroom: string;
}