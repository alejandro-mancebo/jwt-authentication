export type Task = {
    id?: number;
    title: string;
    dueDate: string;//date in string format
    status: Status;
    creator: number;// user id
    participants: number;//user id
}

export enum Status {
    incomplete = "Incomplete",
    pending = "Pending",
    completed = "Completed"
}
