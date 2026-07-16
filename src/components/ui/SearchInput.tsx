import { type InputHTMLAttributes } from "react";
import { TextInput } from "./TextInput";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function SearchInput({ label = "Search", placeholder = "Search…", ...rest }: SearchInputProps) {
  return <TextInput type="search" role="searchbox" label={label} hideLabel placeholder={placeholder} {...rest} />;
}
