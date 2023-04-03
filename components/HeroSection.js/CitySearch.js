import AsyncSelect from "react-select/async"
import { components } from "react-select"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import axios from "../../axiosConfig"

export default (props) => {
    const handleSearchChange = (e) => {
        if (e === null) {
            var newQ = { ...props.queryParams }
            delete newQ.City
            props.setQuery(newQ)
            return
        }
        var stateQ = {}
        if (e.state && e.state !== undefined) {
            stateQ = { State: e.state }
        }
        props.setQuery({ ...props.queryParams, City: e.name, ...stateQ })
    }

    const Control = ({ children, ...props }) => {
        return (
            <components.Control {...props}>
                <MagnifyingGlassIcon className="w-6 h-6 mx-2 my-2" />
                {children}
            </components.Control>
        )
    }

    const getOptions = (inputValue) => {
        console.log("called")
        return axios
            .post("/get_autocomplete", {
                searchQuery: inputValue,
            })
            .then((response) => {
                // console.log(response.data)
                if (response.data.length == 0 || response.data == null) {
                    response.data = [{ name: inputValue }]
                }
                return response.data
            })
    }
    return (
        <AsyncSelect
            cacheOptions
            loadOptions={getOptions}
            components={{ Control }}
            getOptionLabel={(option) => option.name + (option.state ? ", " + option.state : "")}
            isClearable
            onChange={handleSearchChange}
            noOptionsMessage={() => "Search cities"}
            placeholder="Search Cities..."
        />
    )
}
