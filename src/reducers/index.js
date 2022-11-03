import { handleActions, createAction } from 'redux-actions';

export const addEmployee = createAction('ADD_EMPLOYEE');

export const updateEmployeeList = createAction('UPDATE_EMPLOYEE_LIST');

const initialState = {
    employees:[],
};

export default handleActions(
    {
        [addEmployee]: (state, { payload }) => {
            const employees = [...state.employees];
            employees.push(payload);
            return { ...state, employees};
        },
        [updateEmployeeList]: (state, { payload }) => {
           
            return { ...state, employees: payload};
        },
    },
    initialState
)