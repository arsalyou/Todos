import create from "zustand";
import { devtools } from "zustand/middleware";
import createTodoSlice from "./config";
let useStore;
if (process.env.NODE_ENV === "production") {
  useStore = create((set, get) => ({
    ...createTodoSlice(set, get),
   
  }));
} else {
  useStore = create(
    devtools((set, get) => ({
      ...createTodoSlice(set, get),
     
    }))
  );
}
export default useStore;
