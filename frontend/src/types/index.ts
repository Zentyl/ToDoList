export interface Task {
    id: number;
    text: string;
    finished: boolean;
    date: Date | null;
    priority: number;
}