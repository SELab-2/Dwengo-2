import { ClassInterface } from "./classInterface";
import { IUser } from "./userInterface";

export interface IStudent extends IUser {
    classes: ClassInterface[];
}