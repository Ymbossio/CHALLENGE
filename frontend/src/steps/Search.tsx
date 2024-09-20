import { useEffect, useState } from 'react'
import { Data } from '../types'
import { searchData } from '../services/search'
import { toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks'

const Search = ({initialData} : { initialData : Data}) => {

    const [data, setData] = useState<Data>(initialData)
    const [search, setSearch] = useState<string>(() =>{
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    const DEBOUNCE_TIME = 300
    const debouncedSearch = useDebounce(search, DEBOUNCE_TIME)

    const handleSearch = (event : React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(event.target.value)
    }

    useEffect(()=>{
        const newPathName = debouncedSearch === '' 
        ? window.location.pathname : `?q=${debouncedSearch}`

        window.history.replaceState({}, '', newPathName)
    },[debouncedSearch])

    useEffect(()=>{
        if(!debouncedSearch){
            setData(initialData)
            return
        }

        //llamada a la api
        searchData(debouncedSearch)
        .then(response =>{
            const [err, newData] = response
            if(err){
                toast.error(err.message)
                return
            }

            if(newData) setData(newData)
        })
    },[debouncedSearch, initialData])
    
  return (
    <div>
        <h1>Search</h1>
        <form>
            <input onChange={handleSearch} type="text" placeholder='Buscar Información...' defaultValue={search}/>
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