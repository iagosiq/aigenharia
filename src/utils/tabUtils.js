export const validateTabName = (name) => {
    return name.trim().length > 0;
  };
  
  export const initialTabState = {
    name: 'Nova Aba',
    pdfs: [],
    structures: [],
    conversation: {
      structure: "",
      page: "",
      multiple: "",
      detail: ""
    }
  };