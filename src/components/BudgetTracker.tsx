import { useMemo } from "react";
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import {CircularProgressbar, buildStyles} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export default function BudgetTracker() {

  const {state,dispatch} = useBudget()

  const totalExpenses = useMemo(()=>state.expenses.reduce((total,expense)=>expense.amount + total, 0),[state.expenses])

  const remainingBudget = state.budget - totalExpenses

  const percentage = +((totalExpenses / state.budget) * 100).toFixed(2)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex justify-center">
            <CircularProgressbar
            value={percentage}
            styles={buildStyles({
              pathColor: percentage > 90 ? "#dc2626": "#3b82f6",
              trailColor:"#F5F5F5",
              textSize:8,
              textColor:percentage > 90 ? "#dc2626": "#3b82f6"
            })}
            text={`${percentage}% Gastado`}
            />
        </div>
        <div className="flex flex-col justify-center items-center gap-8">
            <button type="button" className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
            onClick={()=>dispatch({type:"reset-budget"})}
            >
                Resetear App
            </button>

            <AmountDisplay label="Presupesto" amount={state.budget}/>
            <AmountDisplay label="Disponible" amount={remainingBudget}/>
            <AmountDisplay label="Gastado" amount={totalExpenses}/>
        </div>
    </div>
  )
}
