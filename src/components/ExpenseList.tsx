import { useMemo } from "react"
import { useBudget } from "../hooks/useBudget"
import ExpenseDetail from "./ExpenseDetail"

export default function ExpenseList() {

    const {state} = useBudget()

    const filterExpendes = state.currentCategory ? state.expenses.filter(expense => expense.category === state.currentCategory) : state.expenses

    const isEmpty = useMemo(()=>filterExpendes.length === 0,[state.expenses, state.currentCategory]) 

  return (
    <div className="mt-10">
        {isEmpty ? <p className="text-gray-600 text-2xl font-bold">No Hay Gastos</p> : (
            <>
                <p className="text-gray-600 text-2xl font-bold my-5">
                    Listado de Gastos
                </p>
                {filterExpendes.map(expense=>(
                    <ExpenseDetail
                    key={expense.id}
                    expense={expense}
                    />
                ))}
            </>
        )}
    </div>
  )
}
