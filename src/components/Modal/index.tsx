/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  DatePicker,
  Stack,
  RadioGroup,
  Radio,
  InputGroup,
} from "rsuite";

enum WorkStatus {
  COME = "come",
  NOTCOME = "notcome",
  LEAVE = "leave",
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

const EventModal = (props: any) => {
  const {
    onClose,
    open,
    onAddEvent,
    values,
    setValues,
    workStatus,
    setWorkStatus,
    ...rest
  } = props;
  const formRef: any = useRef();
  const [formError, setFormError] = useState({});

  // const [expenses, setExpenses] = useState([{ name: "", quantity: null }]);
  const [formValue, setFormValue] = useState({
    work_status: workStatus,
    work_time: { start: "9:00", end: "18:00" },
  });
  console.log("value start", values.start);

  useEffect(() => {
    setFormValue({
      work_status: workStatus,
      work_time: { start: "9:00", end: "18:00" },
    });
  }, [workStatus]);

  const handleChange = (e: any) => {
    setWorkStatus(e);
  };
  // console.log(WorkStatus.COME == values.current.title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOk = (e: any, formValue: any) => {
    if (!formRef.current.check()) {
      return;
    }
    onAddEvent(e, formValue);
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
          onChange={setFormValue}
          onCheck={setFormError}
        >
          <Field
            name="work_status"
            accepter={RadioGroup}
            inline
            value={workStatus}
            onChange={handleChange}
          >
            <Radio value={WorkStatus.COME}>มาทำงาน</Radio>
            <Radio value={WorkStatus.NOTCOME}>หยุด</Radio>
            <Radio value={WorkStatus.LEAVE}>ลางาน</Radio>
          </Field>

          {WorkStatus.COME == workStatus && (
            <>
              <Stack spacing={6}>
                <InputGroup.Addon>เวลามาทำงาน</InputGroup.Addon>
                <DatePicker
                  placeholder="เวลามาทำงาน"
                  format="HH:mm"
                  // value={values.start}
                  defaultValue={new Date(values.start)}
                  onChange={(date: any) => {
                    console.log("date", date);

                    setValues({
                      ...values,
                      start: new Date(date),
                    });
                  }}
                  hideHours={(hour) =>
                    hour < 7 || hour > Number(moment(values.end, "HH:mm"))
                  }
                  hideMinutes={(min) => min < 0}
                  name="start_work"
                />
                <InputGroup.Addon>เวลาเลิกงาน</InputGroup.Addon>
                <DatePicker
                  placeholder="เวลาเลิกงาน"
                  format="HH:mm"
                  defaultValue={new Date(values.end)}
                  onChange={(date: any) => {
                    setValues({
                      ...values,
                      end: new Date(date),
                    });
                  }}
                  hideHours={(hour) =>
                    hour < Number(moment(values.start, "HH:mm").format("H")) ||
                    hour > 23
                  }
                  hideMinutes={(min) => {
                    min < Number(moment(values.start, "HH:mm").format("m")) ||
                      min > 59;
                  }}
                  name="end_work"
                />
              </Stack>

              {/* <Expense /> */}
            </>
          )}
          {WorkStatus.NOTCOME == workStatus && <></>}
          {WorkStatus.LEAVE == workStatus && (
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
          <Button
            appearance="primary"
            onClick={(e: any) => handleOk(e, formValue)}
          >
            บันทึก
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;
