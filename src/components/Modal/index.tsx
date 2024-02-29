/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  DatePicker,
  ModalProps,
  Stack,
  Checkbox,
  Input,
} from "rsuite";
interface EventModalProps extends ModalProps {
  onAddEvent: (event: React.MouseEvent, formValue: any) => void;
  selectedDate: any;
}

const EventModal = (props: EventModalProps) => {
  const { onClose, open, onAddEvent, selectedDate, ...rest } = props;
  const [formValue, setFormValue] = useState({ name: "" });

  const handleOk = (e, formValue: any) => {
    console.log(formValue);
    onAddEvent(e, formValue);
  };

  return (
    <Modal open={open} onClose={onClose} backdrop="static" {...rest}>
      <Modal.Header>
        <Modal.Title>{selectedDate.start}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          fluid
          formValue={formValue}
          onChange={(formValue: any) => setFormValue(formValue)}
        >
          <Form.Group controlId="name">
            <Form.ControlLabel>Event Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.ControlLabel>เวลาเข้างาน</Form.ControlLabel>
            <Form.Control name="description" />
          </Form.Group>
          <Form.Group controlId="location">
            <Form.ControlLabel>เวลาออกงาน</Form.ControlLabel>
            <Form.Control name="location" />
          </Form.Group>
          <Form.Group controlId="location">
            <Form.ControlLabel>เบิกค่าใช้จ่าย</Form.ControlLabel>
            <Form.Control name="location" />
          </Form.Group>
          <Form.Group controlId="start">
            <Form.ControlLabel>Event Date</Form.ControlLabel>
            <Stack spacing={6}>
              <DatePicker
                format="yyyy-MM-dd HH:mm:ss"
                block
                style={{ width: 200 }}
                placeholder="Start Date"
              />
              <DatePicker
                format="yyyy-MM-dd HH:mm:ss"
                block
                style={{ width: 200 }}
                placeholder="End Date"
              />
              <Checkbox>All Day</Checkbox>
            </Stack>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => handleOk(e, formValue)} appearance="primary">
          Submit
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventModal;
