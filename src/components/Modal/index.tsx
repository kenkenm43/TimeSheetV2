/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  DatePicker,
  ModalProps,
  Stack,
  Checkbox,
  RadioGroup,
  Radio,
} from "rsuite";
interface EventModalProps extends ModalProps {
  onAddEvent: (event: React.MouseEvent, formValue: any) => void;
  values: any;
}

enum WorkStatus {
  COME = "Come",
  NOTCOME = "Notcome",
  LEAVE = "Leave",
}

const Field = React.forwardRef((props: any, ref: any) => {
  const { name, message, label, accepter, error, ...rest }: any = props;
  return (
    <Form.Group
      controlId={`${name}-10`}
      ref={ref}
      className={error ? "has-error" : ""}
    >
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        name={name}
        accepter={accepter}
        errorMessage={error}
        {...rest}
      />
      <Form.HelpText>{message}</Form.HelpText>
    </Form.Group>
  );
});

const EventModal = (props: EventModalProps) => {
  const { onClose, open, onAddEvent, values, ...rest } = props;
  const formRef: any = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({});
  // const [work_status, setWork_status] = useState<WorkStatus>(WorkStatus.COME);
  console.log(formValue);

  const handleOk = (e: any, formValue: any) => {
    if (!formRef.current.check()) {
      return;
    }

    onAddEvent(e, { formValue, work_status });
  };

  return (
    <Modal open={open} onClose={onClose} backdrop="static" {...rest}>
      <Modal.Header>
        <Modal.Title>
          {moment(values.start).format("dddd, YYYY MMMM DD")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          fluid
          ref={formRef}
          formValue={formValue}
          onChange={setFormValue}
          onCheck={setFormError}
        >
          <Field
            name="work_status"
            accepter={RadioGroup}
            inline
            defaultValue={WorkStatus.COME}
          >
            <Radio value={WorkStatus.COME}>มาทำงาน</Radio>
            <Radio value={WorkStatus.NOTCOME}>หยุด</Radio>
            <Radio value={WorkStatus.LEAVE}>ลางาน</Radio>
          </Field>
          <Form.Group controlId="workStatus">
            <RadioGroup
              name="workStatus"
              inline
              defaultValue={WorkStatus.COME}
              onChange={(work_status: any) => {
                setWork_status(work_status);
              }}
            ></RadioGroup>
          </Form.Group>
          {formRef.work_status === WorkStatus.COME && (
            <>
              <Form.Group controlId="time">
                เวลาเข้างาน
                <DatePicker
                  name="time"
                  format="HH:mm"
                  ranges={[]}
                  defaultValue={new Date(`${values.start} 09:00`)}
                  hideHours={(hour) => hour < 7 || hour > 23}
                />
                เวลาออกงาน
                <DatePicker
                  name="time"
                  format="HH:mm"
                  ranges={[]}
                  defaultValue={new Date(`${values.start} 09:00`)}
                  hideHours={(hour) => hour < 7 || hour > 23}
                />
              </Form.Group>
              <Field
                accepter={DatePicker}
                format="HH:mm"
                ranges={[]}
                defaultValue={new Date(`${values.start} 09:00`)}
                hideHours={(hour) => hour < 7 || hour > 23}
                name="createDate"
                label="Create Date"
              />
              <Form.Group controlId="endWork">
                <Form.ControlLabel>เวลาออกงาน</Form.ControlLabel>
                <Form.Control name="endWork" />
              </Form.Group>
              <Form.Group controlId="location">
                <Form.ControlLabel>เบิกค่าใช้จ่าย</Form.ControlLabel>
                <Form.Control name="location" />
              </Form.Group>
            </>
          )}
          {formRef.work_status === WorkStatus.NOTCOME && <></>}
          {formRef.work_status === WorkStatus.LEAVE && (
            <>
              <Form.Group controlId="leave_type">
                <Form.ControlLabel>ประเภทการลา</Form.ControlLabel>
                <Form.Control name="leave_type" />
              </Form.Group>
              <Form.Group controlId="leave_cause">
                <Form.ControlLabel>สาเหตุ</Form.ControlLabel>
                <Form.Control name="leave_cause" />
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
            </>
          )}
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
