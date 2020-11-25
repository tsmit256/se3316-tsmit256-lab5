export interface CourseReview{
    message: string;
    lastModified: Date;
    creatorName: string;
    pair: Array<
    {
        subjectCode: string;
        catalog_nbr: string;
    }>;
    hidden: boolean;
    id: number;

}