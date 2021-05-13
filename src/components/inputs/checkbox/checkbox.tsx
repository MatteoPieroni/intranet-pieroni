import React from 'react';
import styled from '@emotion/styled';
import { CheckboxCheckedIcon } from '../../icons/Icon';


interface ICheckboxProps {
    checked: boolean;
    label?: string;
    ariaLabelledBy?: string;
    onChange: () => void;
}

interface IStyledCheckboxProps {
    checked: boolean;
}

const StyledInput = styled.label<IStyledCheckboxProps>`
    display: inline-block;
    width: 1rem;
    background: white;
    text-align: center;
    vertical-align: middle;

    &:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }

    svg.check{
        margin: 0 auto;
        width: 67%;
        height: auto;
        color: white;
        vertical-align: initial;
    }
    
    ${(props): string => props.checked && `
        background: #F13C20;

        &:after {
            content: none;
        }
    `}


`;

export const Checkbox: React.FC<ICheckboxProps> = ({ checked, label, ariaLabelledBy, onChange }) => {
    if (!ariaLabelledBy && !label) {
        throw new Error('Sure you know what you are doing? Missing label and ariaLabelledBy');
    }

    return (
        <StyledInput checked={checked}>
            {checked && <CheckboxCheckedIcon className="check" aria-hidden />}
            <input 
                className="visually-hidden"
                type="checkbox"
                aria-labelledby={ariaLabelledBy}
                checked={checked}
                onChange={onChange}
            />
        </StyledInput>
    )
}