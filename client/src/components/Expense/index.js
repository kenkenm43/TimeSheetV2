import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Button, ButtonGroup, FlexboxGrid, Form, IconButton, Input, InputNumber, Schema, } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import MinusIcon from "@rsuite/icons/Minus";
const { ArrayType, StringType, NumberType, ObjectType } = Schema.Types;
const model = Schema.Model({
    expense: ArrayType().of(ObjectType().shape({
        name: StringType()
            .minLength(6, "Minimum 6 characters required")
            .isRequired("Required."),
        price: NumberType().isRequired("Required."),
    })),
});
const ErrorMessage = ({ children }) => (_jsx("span", { style: { color: "red" }, children: children }));
const Cell = ({ children, style, ...rest }) => (_jsx("td", { style: { padding: "2px 4px 2px 0", verticalAlign: "top", ...style }, ...rest, children: children }));
const ProductItem = ({ rowValue = {}, onChange, rowIndex, rowError }) => {
    const handleChangeName = (value) => {
        onChange(rowIndex, { ...rowValue, name: value });
    };
    const handleChangeAmount = (value) => {
        onChange(rowIndex, { ...rowValue, quantity: value });
    };
    return (_jsxs("tr", { children: [_jsxs(Cell, { children: [_jsx(Input, { value: rowValue.name, onChange: handleChangeName, style: { width: 196 } }), rowError ? (_jsx(ErrorMessage, { children: rowError.name.errorMessage })) : null] }), _jsxs(Cell, { children: [_jsx(InputNumber, { min: 0, value: rowValue.quantity, onChange: handleChangeAmount, style: { width: 100 } }), rowError ? (_jsx(ErrorMessage, { children: rowError.quantity.errorMessage })) : null] })] }));
};
const ProductInputControl = ({ value = [], onChange, fieldError }) => {
    const errors = fieldError ? fieldError.array : [];
    const [products, setProducts] = React.useState(value);
    const handleChangeProducts = (nextProducts) => {
        setProducts(nextProducts);
        onChange(nextProducts);
    };
    const handleInputChange = (rowIndex, value) => {
        const nextProducts = [...products];
        nextProducts[rowIndex] = value;
        handleChangeProducts(nextProducts);
    };
    const handleMinus = () => {
        handleChangeProducts(products.slice(0, -1));
    };
    const handleAdd = () => {
        handleChangeProducts(products.concat([{ name: "", quantity: null }]));
    };
    return (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx(Cell, { children: "\u0E40\u0E1A\u0E34\u0E01\u0E04\u0E48\u0E32\u0E43\u0E0A\u0E49\u0E08\u0E48\u0E32\u0E22" }), _jsx(Cell, { children: "\u0E01\u0E35\u0E48\u0E1A\u0E32\u0E17" })] }) }), _jsx("tbody", { children: products.map((rowValue, index) => (_jsx(ProductItem, { rowIndex: index, rowValue: rowValue, rowError: errors[index] ? errors[index].object : null, onChange: handleInputChange }, index))) }), _jsx("tfoot", { children: _jsx("tr", { children: _jsx(Cell, { colSpan: 2, style: { paddingTop: 10 }, children: _jsxs(ButtonGroup, { size: "xs", children: [_jsx(IconButton, { onClick: handleAdd, icon: _jsx(PlusIcon, {}) }), _jsx(IconButton, { onClick: handleMinus, icon: _jsx(MinusIcon, {}) })] }) }) }) })] }));
};
const index = () => {
    const formRef = useRef();
    const [formError, setFormError] = useState({});
    const [formValue, setFormValue] = useState({
        expense: [{ name: "", quantity: null }],
    });
    return (_jsx(FlexboxGrid, { children: _jsx(FlexboxGrid.Item, { colspan: 12, children: _jsxs(Form, { ref: formRef, checkTrigger: "blur", onChange: setFormValue, onCheck: setFormError, formValue: formValue, model: model, children: [_jsx(Form.Control, { name: "expense", accepter: ProductInputControl, fieldError: formError.products }), _jsx(Button, { appearance: "primary", onClick: () => {
                            formRef.current.check();
                            console.log(formValue);
                        }, children: "Submit" })] }) }) }));
};
export default index;
