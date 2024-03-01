/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  FlexboxGrid,
  Form,
  IconButton,
  Input,
  InputNumber,
  Schema,
} from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import MinusIcon from "@rsuite/icons/Minus";

const { ArrayType, StringType, NumberType, ObjectType } = Schema.Types;
const model = Schema.Model({
  products: ArrayType().of(
    ObjectType().shape({
      name: StringType()
        .minLength(6, "Minimum 6 characters required")
        .isRequired("Required."),
      quantity: NumberType().isRequired("Required."),
    })
  ),
});

const ErrorMessage = ({ children }: any) => (
  <span style={{ color: "red" }}>{children}</span>
);
const Cell = ({ children, style, ...rest }: any) => (
  <td
    style={{ padding: "2px 4px 2px 0", verticalAlign: "top", ...style }}
    {...rest}
  >
    {children}
  </td>
);

const ProductItem = ({ rowValue = {}, onChange, rowIndex, rowError }: any) => {
  const handleChangeName = (value: any) => {
    onChange(rowIndex, { ...rowValue, name: value });
  };
  const handleChangeAmount = (value: any) => {
    onChange(rowIndex, { ...rowValue, quantity: value });
  };

  return (
    <tr>
      <Cell>
        <Input
          value={rowValue.name}
          onChange={handleChangeName}
          style={{ width: 196 }}
        />
        {rowError ? (
          <ErrorMessage>{rowError.name.errorMessage}</ErrorMessage>
        ) : null}
      </Cell>
      <Cell>
        <InputNumber
          min={0}
          value={rowValue.quantity}
          onChange={handleChangeAmount}
          style={{ width: 100 }}
        />
        {rowError ? (
          <ErrorMessage>{rowError.quantity.errorMessage}</ErrorMessage>
        ) : null}
      </Cell>
    </tr>
  );
};

const ProductInputControl = ({ value = [], onChange, fieldError }: any) => {
  const errors = fieldError ? fieldError.array : [];
  const [products, setProducts] = React.useState(value);
  const handleChangeProducts = (nextProducts: any) => {
    setProducts(nextProducts);
    onChange(nextProducts);
  };
  const handleInputChange = (rowIndex: any, value: any) => {
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
  return (
    <table>
      <thead>
        <tr>
          <Cell>เบิกค่าใช้จ่าย</Cell>
          <Cell>จำนวน</Cell>
        </tr>
      </thead>
      <tbody>
        {products.map((rowValue: any, index: any) => (
          <ProductItem
            key={index}
            rowIndex={index}
            rowValue={rowValue}
            rowError={errors[index] ? errors[index].object : null}
            onChange={handleInputChange}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <Cell colSpan={2} style={{ paddingTop: 10 }}>
            <ButtonGroup size="xs">
              <IconButton onClick={handleAdd} icon={<PlusIcon />} />
              <IconButton onClick={handleMinus} icon={<MinusIcon />} />
            </ButtonGroup>
          </Cell>
        </tr>
      </tfoot>
    </table>
  );
};

const index = () => {
  const formRef = useRef<any>();
  const [formError, setFormError] = useState<any>({});
  const [formValue, setFormValue] = useState<any>({
    expense: [{ name: "", quantity: null }],
  });
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={12}>
        <Form
          ref={formRef}
          checkTrigger="blur"
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={model}
        >
          <Form.Control
            name="expense"
            accepter={ProductInputControl}
            fieldError={formError.products}
          />

          <hr />
          <Button
            appearance="primary"
            onClick={() => {
              formRef.current.check();
            }}
          >
            Submit
          </Button>
        </Form>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default index;
