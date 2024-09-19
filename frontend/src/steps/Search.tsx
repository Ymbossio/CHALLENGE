import { useEffect, useState } from 'react'
import { Data } from '../types'
import { searchData } from '../services/search'
import { toast } from 'sonner'

const Search = ({initialData} : { initialData : Data}) => {

    const [data, setData] = useState<Data>(initialData)
    const [search, setSearch] = useState<string>('')


    const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(event.target.value)
    }

    useEffect(()=>{
        const newPathName = search === '' 
        ? window.location.pathname : `?q=${search}`

        window.history.replaceState({}, '', newPathName)
    },[search])

    useEffect(()=>{
        if(!search){
            setData(initialData)
            return
        }

        //llamada a la api
        searchData(search)
        .then(response =>{
            const [err, newData] = response
            if(err){
                toast.error(err.message)
                return
            }

            if(newData) setData(newData)
        })
    },[search, initialData])
    
  return (
    <div>
        <h1>Search</h1>
        <form>
            <input onChange={handleSearch} type="text" placeholder='Buscar Información...' />
        </form>

        <ul>
            {data.map((row) =>(
                <li key={row.id}>
                    <article>
                      {Object.
                        entries(row)
                        .map(([key, value]) => <p key={key}><strong>{key}:</strong>{value}</p>)
                      }
                    </article>
                </li>
            ))}
        </ul>


    </div>
  )
}

export default Search