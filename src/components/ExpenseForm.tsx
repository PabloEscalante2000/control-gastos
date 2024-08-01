import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useMemo, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";


export default function ExpenseForm() {

  const initialExpense : DraftExpense = {
    amount:0,
    expenseName:"",
    category:"",
    date:new Date()
  }
  
  const [expense,setExpense] = useState<DraftExpense>(initialExpense)
  const [error, setError] = useState("")
  const {dispatch, state} = useBudget()

  const totalExpenses = useMemo(()=>state.expenses.reduce((total,expense)=>expense.amount + total, 0),[state.expenses])

  const remainingBudget = state.budget - totalExpenses

  useEffect(()=>{
    if(state.editingId){
      const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
      setExpense(editingExpense)
    }
  },[state.editingId])

  const handleChange = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target
    const isAmountField = ["amount"].includes(name)
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value
    })
  }

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date:value
    })
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //Validar
    if(Object.values(expense).includes("")) {
      setError("Todos los campos son abligatorios")
      return
    }

    

    //Agregar o Actualizar el gasto
    if(state.editingId){
      const budgetState = state.expenses.find(e=>e.id === state.editingId)?.amount
      const restBudget = (remainingBudget + budgetState!) - expense.amount
      if(restBudget < 0){
        setError(`Ups.. Parece que te has rebasado de tu presupuesto: Estarías con ${restBudget}$ en tu presupuesto`)
        return
      }
      dispatch({type:"update-expense",payload:{expense:{...expense, id:state.editingId}}})
    } else {
      if(remainingBudget - expense.amount < 0) {
        setError(`Ups.. Parece que te has rebasado de tu presupuesto: Estarías con ${remainingBudget - expense.amount}$ en tu presupuesto`)
        return
      }
      dispatch({type:"add-expense", payload:{expense}})
    }
    

    //Reiniciar state
    setExpense(initialExpense)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-blue-500 py-2">
            {state.editingId ? "Guardar Cambios" : "Nuevo Gasto"}
        </legend>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">Nombre Gasto:</label>
            <input
            type="text"
            id="expenseName"
            placeholder="Añade el Nombre del gasto"
            className="bg-slate-100 p-2"
            name="expenseName"
            value={expense.expenseName}
            onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-xl">Cantidad:</label>
            <input
            type="number"
            id="amount"
            placeholder="Añade la cantidad del gasto ej. 300"
            className="bg-slate-100 p-2"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            />
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">Categoría:</label>
            <select
            id="category"
            className="bg-slate-100 p-2"
            name="category"
            value={expense.category}
            onChange={handleChange}
            >
              <option value={""}>-- Seleccione --</option>
              {categories.map(category => (
                <option 
                key={category.id}
                value={category.id}
                >{category.name}</option>
              ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">Fecha Gasto:</label>
            <DatePicker className="bg-slate-100 p-2 border-0"
            value={expense.date}
            onChange={handleChangeDate}
            />
        </div>

        <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? "Actualizar Gasto" : "Registrar Gasto"}
        />
    </form>
  )
}
