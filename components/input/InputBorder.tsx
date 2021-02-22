import React, { useContext } from 'react';
import './Input.scss';
import InputBase from '@material-ui/core/InputBase';
import { Context } from '../../context/store';

interface IInputProps {
    size?: number;
    className?: string;
    name: string;
    type?: string;
    placeholder?: string;
    onChange: any;
    autoFocus?: boolean;
    value: string;
    defaultValue?: string;
    error?: any;
    rows?: number;
    multiline?: any;
    autoComplete?: any;
    handleBlur?: any;
    submitEnter?: any;
}
export const InputBorder = (props: IInputProps) => {
    const {
        size,
        rows,
        className,
        name,
        type,
        placeholder,
        onChange,
        autoFocus,
        value,
        defaultValue,
        error,
        multiline,
        autoComplete,
        handleBlur,
        submitEnter,
    } = props;

    const [store] = useContext(Context);
    const { isDark } = store;

    return (
        <div className={'input__wrapper-border'}>
            <InputBase
                className={
                    className
                        ? className
                        : `input__text${size ? size : ''}${isDark ? '--dark' : ''}`
                }
                name={name}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                disabled={!!defaultValue}
                defaultValue={defaultValue}
                autoFocus={autoFocus}
                value={value}
                error={error}
                rows={rows}
                multiline={multiline}
                autoComplete={autoComplete ? autoComplete : 'off'}
                onBlur={handleBlur}
                onKeyPress={(ev) => {
                    if (submitEnter) {
                        if (ev.key === 'Enter') {
                            // Do code here
                            props.submitEnter();
                            ev.preventDefault();
                        }
                    }
                }}
            />
        </div>
    );
};
