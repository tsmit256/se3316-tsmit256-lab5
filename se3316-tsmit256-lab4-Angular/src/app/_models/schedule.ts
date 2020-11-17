export interface Schedule{
    name: string;
    pairs: Array<{
        subjectCode: string;
        catalog_nbr: string;
    }>
} 

export interface ScheduleCount{
    name: string;
    courseCount: number;
}

export interface Pair{
    subjectCode: string;
    catalog_nbr: string;
}