import React from "react";
import { ErrorMessage, useField } from "formik";
import ExternalSelect, { OptionsType, ValueType } from "react-select";

import { Icon } from "../../icons";
import { IFieldProps, StyledField } from "../field";

export interface SelectOption {
  label: string;
  value: string;
}

export interface CustomSelectProps extends IFieldProps {
  options: OptionsType<SelectOption>;
  isMulti?: boolean;
}

export const Select: React.FC<CustomSelectProps> = ({
  name,
	label,
	hint,
  options,
  isMulti = false,
}: CustomSelectProps) => {
	const [field, meta, helpers] = useField(name);

  const onChange = (option: ValueType<SelectOption | SelectOption[], boolean>): void => {
		helpers.setValue(
      isMulti
        ? (option as SelectOption[]).map((item: SelectOption) => item.value)
        : (option as SelectOption).value
    );
  };

  const getValue = (): ValueType<SelectOption | SelectOption[], boolean> => {
    if (options) {
      return isMulti
        ? options.filter(option => field.value.indexOf(option.value) >= 0)
        : options.find(option => option.value === field.value);
    } else {
      return isMulti ? [] : ("" as any);
    }
  };

  return (
    <StyledField className="field-container">
			<label htmlFor={name}>{label}</label>
			{hint && <span className="hint"><Icon.InfoCircle /> {hint}</span>}
			<ExternalSelect
				name={field.name}
				value={getValue()}
				onChange={onChange}
				options={options}
				isMulti={isMulti}
			/>
			<span className="error"><ErrorMessage name={name} /></span>
    </StyledField>
  );
};
