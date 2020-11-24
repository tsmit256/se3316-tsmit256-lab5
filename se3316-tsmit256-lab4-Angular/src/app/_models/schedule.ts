export interface Schedule{
    name: string;
    schedId: number;
    pairs: Array<{
        subjectCode: string;
        catalog_nbr: string;
    }>
    lastModified?: Date;
    creatorName?: string;
    creatorId: string;
    description?: string
    public: boolean;
} 

export interface Pair{
    subjectCode: string;
    catalog_nbr: string;
}

export interface PublicSchedule{
    name: string;
    lastModified: Date;
    creatorName: string;
    courseCount: number;
    showDetail?: boolean;
}