import React from 'react';
import styled from '@emotion/styled';
import { CheckboxCheckedIcon } from '../../icons/Icon';
import { SerializedStyles } from '@emotion/utils';


interface ICheckboxProps {
    checked: boolean;
    label?: string;
    ariaLabelledBy?: string;
    onChange: () => void;
    getStyles?: (checked: boolean) => SerializedStyles;
}

interface IStyledCheckboxProps {
    checked: boolean;
    getStyles?: (checked: boolean) => SerializedStyles;
}

const StyledLabel = styled.label<IStyledCheckboxProps>`
    display: inline-block;

    &:before {
        content: "";
        display: inline-block;
        border: 1px solid black;
        width: 1rem;
        height: 1rem;
    }

    svg.check{
        margin: 0 auto;
        width: 1rem;
        height: auto;
        color: white;
        vertical-align: bottom;
    }
    
    ${(props): string => props.checked && `
        &:before {
            content: none;
        }

        svg.check {
            background: #F13C20;
        }
    `}

    ${(props): SerializedStyles => props?.getStyles?.(props.checked)}
`;

const StyledFakedLabel = styled.label<IStyledCheckboxProps>`
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

    &:focus-within:after {
        outline: dashed 3px #F13C20;
    }
    
    ${(props): string => props.checked && `
        background: #F13C20;

        &:focus-within {
            outline: dashed 3px #fff;
        }

        &:after {
            content: none;
        }
    `}

    ${(props): SerializedStyles => props?.getStyles?.(props.checked)}
`;

export const Checkbox: React.FC<ICheckboxProps> = ({ checked, label, ariaLabelledBy, onChange, getStyles }) => {
    if (!ariaLabelledBy && !label) {
        throw new Error('Sure you know what you are doing? Missing label and ariaLabelledBy');
    }

    if (label) {
        return (
            <StyledLabel checked={checked}>
                {checked && <CheckboxCheckedIcon className="check" aria-hidden />}
                {label}
                <input 
                    className="visually-hidden"
                    type="checkbox"
                    aria-labelledby={ariaLabelledBy}
                    checked={checked}
                    onChange={onChange}
                />
            </StyledLabel>
        );
    }

    return (
        <StyledFakedLabel checked={checked} getStyles={getStyles}>
            {checked && <CheckboxCheckedIcon className="check" aria-hidden />}
            {!ariaLabelledBy && label}
            <input 
                className="visually-hidden"
                type="checkbox"
                aria-labelledby={ariaLabelledBy}
                checked={checked}
                onChange={onChange}
            />
        </StyledFakedLabel>
    )
}