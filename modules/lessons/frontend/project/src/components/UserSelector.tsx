import {UserDto} from "../generated/tools-ui-frontend.ts";
import {ListBox, ListBoxChangeEvent} from "primereact/listbox";
import {useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";

interface UserSelectorProps {
    value: UserDto
    userSelection: UserDto[]
    allUsers: UserDto[]
    setValue: (newValue: UserDto) => void
}

export default function UserSelector({value, userSelection, allUsers, setValue}: UserSelectorProps) {
    const [selectedUser, setSelectedUser] = useState<UserDto>()
    const [selectionOptions, setSelectionOptions] = useState<UserDto[]>(userSelection)

    // If the selected user was not in the list, add it.
    if(value && selectionOptions && !selectionOptions.find(currentValue => currentValue.id == value.id)) {
        setSelectionOptions([...selectionOptions, value])
    }

    return (
        <>
            <ListBox value={value}
                     onChange={(e: ListBoxChangeEvent) => setValue(e.value)}
                     options={selectionOptions}
                     optionLabel="name"
                     className="w-full"/>
            <div className="flex flex-column md:flex-row gap-4 mt-4">
                <Dropdown value={selectedUser}
                          onChange={(e) => setSelectedUser(e.value)}
                          options={allUsers}
                          optionLabel="name"
                          filter
                          className="flex-1"/>
                <Button disabled={!selectedUser}
                        onClick={()=> {
                            if(selectedUser) {
                                setSelectionOptions([...selectionOptions, selectedUser])
                            }
                        }}
                        label="Add"
                        className="flex-1"/>
            </div>
        </>
    )
}