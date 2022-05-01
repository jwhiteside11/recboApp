import React, { SetStateAction } from 'react'
import InputBar from '../InputBar/InputBar';

type SearchBarProps = {
  content: string,
  setter: React.Dispatch<SetStateAction<string>>
}

const  SearchBar = ({content, setter}: SearchBarProps) => {

  return (
    <InputBar placeholder="Search..." data={content} setter={setter} />
  )

}

export default SearchBar;