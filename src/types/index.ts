interface BaseField {
    name: string;
    label?: string;
    placeholder?: string;
  }
  
  interface MapField extends BaseField {
    type: "map";
    defaultLocation?: { lat: number; lng: number }; 
  }

  
  interface ImageField extends BaseField {
    type: "image";
  }

  
  interface TextField extends BaseField {
    type: "text" | "password" | "email";
  }
  
 export interface TextareaField extends BaseField {
    type: "textarea";
    rows?: number; description:string, errorText:""
  }
  
  interface MySelectField extends BaseField {
    type: 'mySelect';
    options: { label: string; value: string }[];
    disabled?: boolean;
    showSearch?: boolean;
    allowClear?: boolean;
  }

  interface MyInput extends BaseField {
    type: 'myInput';
  }
  
  
  interface SelectField extends BaseField {
    type: "select";
    disabled?:boolean;
    options: any;
  }
  

 export type Field = TextField | TextareaField | SelectField |ImageField | MapField | MySelectField | MyInput;
  