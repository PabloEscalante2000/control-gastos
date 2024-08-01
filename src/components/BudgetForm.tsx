import { useState } from "react"
import { useBudget } from "../hooks/useBudget"

export default function BudgetForm() {
  
    const [budget, setBudget] = useState(0)
    const {dispatch} = useBudget()
  
    const handleChange = (e:number)=>{
        setBudget(e)
    }

    const handleSumbit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({type:"add-budget",payload:{budget:budget}})
    }
    
    return (
    <form className="space-y-5" onSubmit={handleSumbit}>
        <div className="flex flex-col space-y-5">
            <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">
                Definir Presupuesto
            </label>
            <input
            id="budget"
            type="number"
            className="w-full border border-gray-200 p-2"
            placeholder="Define tu presupuesto"
            name="budget"
            value={budget}
            onChange={(e)=>handleChange(Number(e.target.value))}
            />
        </div>
        <input
        type="submit"
        value="Definir Presupuesto"
        className="p-2 bg-blue-600 hover:bg-blue-700 cursor-pointer w-full text-white font-black uppercase disabled:opacity-40"
        disabled={budget <= 0 || isNaN(budget)}
        />
    </form>
  )
}
