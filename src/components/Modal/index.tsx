/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  DatePicker,
  ModalProps,
  Stack,
  RadioGroup,
  Radio,
  InputGroup,
} from "rsuite";
import Expense from "../Expense";
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
  const [work_status, setWork_status] = useState<WorkStatus>(values.title);
  const [expenses, setExpenses] = useState([{ name: "", quantity: null }]);
  const [work_time, setWork_time] = useState({ start: "9:00", end: "18:00" });
  const [formValue, setFormValue] = useState({
    work_status: values.title,
    work_time: { start: "9:00", end: "18:00" },
    expenses: [{ name: "", quantity: null }],
  });
  console.log("title", values.title);
  console.log(work_status);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setWork_status(values.title);
  }, [values.title]);

  const handleOk = (e: any, formValue: any) => {
    if (!formRef.current.check()) {
      return;
    }

    onAddEvent(e, formValue);
    setWork_time({ start: "9:00", end: "18:00" });
    setExpenses([]);
  };
  return (
    <Modal open={open} onClose={onClose} backdrop="static" {...rest}>
      <Modal.Header>
        <Modal.Title>
          {values.title}
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
            onChange={(work_status: any) => {
              setWork_status(work_status);
            }}
            defaultValue={values.title}
          >
            <Radio value={WorkStatus.COME}>มาทำงาน</Radio>
            <Radio value={WorkStatus.NOTCOME}>หยุด</Radio>
            <Radio value={WorkStatus.LEAVE}>ลางาน</Radio>
          </Field>
          {work_status === WorkStatus.COME && (
            <>
              <Stack spacing={6}>
                <InputGroup.Addon>เวลามาทำงาน</InputGroup.Addon>
                <DatePicker
                  placeholder="เวลามาทำงาน"
                  format="HH:mm"
                  defaultValue={new Date(`${values.start} ${work_time.start}`)}
                  onChange={(date: any) => {
                    setWork_time({
                      ...work_time,
                      start: moment(date).format("HH:mm"),
                    });
                  }}
                  hideHours={(hour) =>
                    hour < 7 ||
                    hour > Number(moment(work_time.end, "HH:mm").format("H"))
                  }
                  hideMinutes={(min) =>
                    min < 0 ||
                    min >= Number(moment(work_time.end, "HH:mm").format("m"))
                  }
                  name="start_work"
                />
                <InputGroup.Addon>เวลาเลิกงาน</InputGroup.Addon>
                <DatePicker
                  placeholder="เวลาเลิกงาน"
                  format="HH:mm"
                  defaultValue={new Date(`${values.start} ${work_time.end}`)}
                  onChange={(date: any) => {
                    setWork_time({
                      ...work_time,
                      end: moment(date).format("HH:mm"),
                    });
                  }}
                  hideHours={(hour) =>
                    hour <
                      Number(moment(work_time.start, "HH:mm").format("H")) ||
                    hour > 23
                  }
                  hideMinutes={(min) => {
                    min <
                      Number(moment(work_time.start, "HH:mm").format("m")) ||
                      min >= 59;
                  }}
                  name="end_work"
                />
              </Stack>
              <Expense />
            </>
          )}
          {work_status === WorkStatus.NOTCOME && <></>}
          {work_status === WorkStatus.LEAVE && (
            <>
              <Form.Group controlId="leave_type">
                <Form.ControlLabel>ประเภทการลา</Form.ControlLabel>
                <Form.Control name="leave_type" />
              </Form.Group>
              <Form.Group controlId="leave_cause">
                <Form.ControlLabel>สาเหตุ</Form.ControlLabel>
                <Form.Control name="leave_cause" />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
