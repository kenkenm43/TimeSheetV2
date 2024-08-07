/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment-timezone";
import React, { useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  DatePicker,
  Stack,
  RadioGroup,
  Radio,
  InputGroup,
  SelectPicker,
  CheckboxGroup,
  Checkbox,
} from "rsuite";
import {
  deleteLeaveSchedule,
  deleteWorkSchedule,
} from "../../services/employeeServices";
import useEmployeeStore from "../../context/EmployeeProvider";

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

const modalStyle = {
  display: "flex",
  alignItems: "center",
};
const contentStyle = {
  minWidth: "600px",
  minHeight: "350px",
};
const EventModal = (props: any) => {
  const {
    workReason,
    setWorkReason,
    handleDelete,
    type,
    idCalendar,
    onClose,
    open,
    onAddEvent,
    values,
    setValues,
    workStatus,
    setWorkStatus,
    leaveType,
    setLeaveType,
    leaveReason,
    setLeaveReason,
    leaveCause,
    setLeaveCause,
    checkBoxed,
    setCheckBoxed,
    ...rest
  } = props;
  const formRef: any = useRef();
  const [formError, setFormError] = useState({});
  // const [expenses, setExpenses] = useState([{ name: "", quantity: null }]);
  const [formValue, setFormValue] = useState({
    work_status: workStatus,
  });
  const data = ["ลาป่วย", "ลาโดยใช้วันหยุด"].map((item) => ({
    label: item,
    value: item,
  }));
  const handleCheckBox = (e: any) => {
    setCheckBoxed(e);
  };
  const handleChange = (e: any) => {
    setWorkStatus(e);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOk = (e: any, formValue: any) => {
    if (!formRef.current.check()) {
      return;
    }
    onAddEvent(e, formValue, leaveType);
    setFormValue({ work_status: WorkStatus.COME });
    setLeaveType("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      centered
      backdrop="static"
      {...rest}
      sx={{ zIndex: 2 }}
      style={modalStyle}
    >
      <div style={contentStyle}>
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
              <Radio value={WorkStatus.NOTCOME}>วันหยุดบริษัท</Radio>
              <Radio value={WorkStatus.LEAVE}>ลางาน</Radio>
            </Field>

            {WorkStatus.COME == workStatus && (
              <>
                <div className="mb-2 pb-1">
                  <CheckboxGroup
                    inline
                    name="checkbox-group"
                    value={checkBoxed}
                    onChange={(e: any) => handleCheckBox(e)}
                  >
                    <Checkbox value="OT">OT</Checkbox>
                    <Checkbox value="Perdiem">Per Diem</Checkbox>
                  </CheckboxGroup>
                </div>
                <Stack spacing={6}>
                  <InputGroup.Addon>เวลามาทำงาน</InputGroup.Addon>
                  <DatePicker
                    cleanable={false}
                    placeholder="เวลามาทำงาน"
                    format="HH:mm"
                    value={values.start}
                    onSelect={(date: any) => {
                      setValues({
                        ...values,
                        start: date,
                      });
                    }}
                    onChange={(date: any) => {
                      setValues({
                        ...values,
                        start: date,
                      });
                    }}
                    hideHours={(hour) =>
                      hour < 7 || hour > moment(values.end, "HH:mm").hour()
                    }
                    hideMinutes={(min) =>
                      moment(values.start, "HH:mm").hour() ===
                      moment(values.end, "HH:mm").hour()
                        ? min >= moment(values.end, "HH:mm").minute()
                        : min > 59
                    }
                    name="start_work"
                  />
                  <InputGroup.Addon>เวลาเลิกงาน</InputGroup.Addon>
                  <DatePicker
                    cleanable={false}
                    name="end"
                    placeholder="เวลาเลิกงาน"
                    format="HH:mm"
                    value={values.end}
                    onSelect={(date: any) => {
                      setValues({
                        ...values,
                        end: date,
                      });
                    }}
                    onChange={(date: any) => {
                      setValues({
                        ...values,
                        end: date,
                      });
                    }}
                    hideHours={(hour) =>
                      hour < moment(values.start, "HH:mm").hour() || hour > 23
                    }
                    hideMinutes={(min) =>
                      moment(values.start, "HH:mm").hour() ===
                      moment(values.end, "HH:mm").hour()
                        ? min <= moment(values.start, "HH:mm").minute()
                        : min < 0
                    }
                  />
                </Stack>
                <Form.Group controlId="work_reason">
                  <Form.ControlLabel>เหตุผล</Form.ControlLabel>
                  <Form.Control
                    name="work_reason"
                    value={workReason}
                    onChange={setWorkReason}
                  />
                </Form.Group>
                {/* {<Expense /> */}
              </>
            )}
            {WorkStatus.NOTCOME == workStatus && (
              <>
                {" "}
                {
                  <Form.Group controlId="work_reason">
                    <Form.ControlLabel>เหตุผล</Form.ControlLabel>
                    <Form.Control
                      name="work_reason"
                      value={workReason}
                      onChange={setWorkReason}
                    />
                  </Form.Group>
                }
              </>
            )}
            {WorkStatus.LEAVE == workStatus && (
              <>
                <Form.Group controlId="leave_cause">
                  <Form.ControlLabel>ประเภทการลา</Form.ControlLabel>
                  <SelectPicker
                    data={data}
                    name="leave_cause"
                    value={leaveCause}
                    onChange={setLeaveCause}
                  />
                </Form.Group>

                <Form.Group controlId="leave_reason">
                  <Form.ControlLabel>เหตุผล</Form.ControlLabel>
                  <Form.Control
                    name="leave_reason"
                    value={leaveReason}
                    onChange={setLeaveReason}
                  />
                </Form.Group>
              </>
            )}
            <div className="mt-6 flex w-full justify-between">
              <Button
                appearance="primary"
                onClick={(e: any) => handleOk(e, formValue)}
              >
                บันทึก
              </Button>
              {idCalendar && (
                <Button
                  color="red"
                  appearance="primary"
                  onClick={(e: any) => handleDelete(e, formValue)}
                >
                  ลบ
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default EventModal;
