import { Frequency } from "./Frequency";
import { Question } from "./Question";
import { ThresholdCollection } from "./ThresholdCollection";

export class Questionnaire {
    id! : string;
    name?: string;
    frequency?: Frequency;
    thresholds?: ThresholdCollection[];
    questions? : Question[]
}