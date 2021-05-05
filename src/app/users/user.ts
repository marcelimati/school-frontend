import { Subject } from '../settings/subject';

export interface User {
    id: string;
    _id: string;
    username: string;
    subjects: Subject[];
    role: string;
    classroom: string;
  }