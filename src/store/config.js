const createTodoSlice = (set, get) => ({
    todos: [],
    setTodos : (payload => {
        set({todos: payload})
    }),

})

export default createTodoSlice;
