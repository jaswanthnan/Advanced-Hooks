import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Input, InputRef } from 'antd';

export interface CustomInputHandle {
  focus: () => void;
  clear: () => void;
  getValue: () => string | undefined;
}

interface CustomInputProps {
  [key: string]: any;
}

/**
 * CustomInput: Uses forwardRef and useImperativeHandle to expose specific 
 * methods (like focus and clear) to the parent component.
 */
const CustomInput = forwardRef<CustomInputHandle, CustomInputProps>((props, ref) => {
  const inputRef = useRef<InputRef>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      // Ant Design Input has a 'setSelectionRange' or similar, but for clear 
      // we usually just trigger a change or use internal methods if available.
      // Most reliable way for an uncontrolled internal ref is focus + clear.
      if (inputRef.current?.input) {
        inputRef.current.input.value = '';
      }
    },
    // Expose value for verification
    getValue: () => inputRef.current?.input?.value
  }));

  return <Input {...props} ref={inputRef} />;
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
