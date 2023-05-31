export type languages = "Français" | "Anglaise" | "Allemande" | "Italien";

export interface StudentT {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  addresse?: string;
  email?: string;
  image?: any;
  // groupid: number;
}

export interface newStudentT extends Omit<StudentT, "id"> {}
export interface updateStudentT extends Partial<StudentT> {
  [key: string]: any;
}
/////////////////////////////////
///////////////////////////////////
//////////////////////////////////
export interface TeacherT {
  id: number;
  firstname: string;
  lastname: string;
  fullname: string;
  phone?: string;
  // addresse?: string;
  email?: string;
  image?: any;
}

export interface newTeacherT extends Omit<TeacherT, "id"> {}
export interface updateTeacherT extends Partial<TeacherT> {
  [key: string]: any;
}

///////////////// OTHERS //////////
export interface AssistantT {
  id: number;
  firstname: string;
  lastname: string;
  phone?: string;
  email?: string;
  image?: any;
}

export interface newAssistantT extends Omit<AssistantT, "id"> {}
export interface updateAssistantT extends Partial<AssistantT> {
  [key: string]: any;
}
////////////////////////
////////////////////////////////////
//////////////////////////////
/////////////////////////////////////

export interface GroupT {
  id: number;
  name: string;
  languagename: string;
  levelname: string;
  modulename: string;
  agename: string;
  teacherid: number;
}

export interface newGroupT extends Omit<GroupT, "id"> {}
export interface updateGroupT extends Partial<GroupT> {
  [key: string]: any;
}

//
export interface AffiliationT {
  id: number;
  studentid: number;
  group: any;
  amount: number;
  month: string;
}

export interface newAffiliationT extends Omit<AffiliationT, "id" | "month"> {
  months: number[];
}
export interface updateAffiliationT extends Partial<AffiliationT> {
  [key: string]: any;
}

export interface SalaryT {
  id: number;
  teacherid: number;
  groupid: number;
  amount: number;
  monthid: number;
  date: string;
  payment_type: string;
  payment_amount: number;
}

export interface newSalaryT extends Omit<SalaryT, "id"> {}
export interface updateSalaryT extends Partial<SalaryT> {
  [key: string]: any;
}
