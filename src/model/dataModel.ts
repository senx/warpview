import {Param} from "./param";

export class DataModel {
  data: any[] | string;
  params? : Param[];
  globalParams?: Param;
}
