import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment-timezone";
import React, { useRef, useState } from "react";
import { Modal, Button, Form, DatePicker, Stack, RadioGroup, Radio, InputGroup, SelectPicker, CheckboxGroup, Checkbox, } from "rsuite";
var WorkStatus;
(function (WorkStatus) {
    WorkStatus["COME"] = "come";
    WorkStatus["NOTCOME"] = "notcome";
    WorkStatus["LEAVE"] = "leave";
})(WorkStatus || (WorkStatus = {}));
const Field = React.forwardRef((props, ref) => {
    const { name, message, label, accepter, error, ...rest } = props;
    return (_jsxs(Form.Group, { controlId: `${name}-10`, ref: ref, className: error ? "has-error" : "", children: [_jsxs(Form.ControlLabel, { children: [label, " "] }), _jsx(Form.Control, { name: name, accepter: accepter, errorMessage: error, ...rest }), _jsx(Form.HelpText, { children: message })] }));
});
const EventModal = (props) => {
    const { onClose, open, onAddEvent, values, setValues, workStatus, setWorkStatus, leaveType, setLeaveType, leaveReason, setLeaveReason, leaveCause, setLeaveCause, checkBoxed, setCheckBoxed, ...rest } = props;
    const formRef = useRef();
    const [formError, setFormError] = useState({});
    // const [expenses, setExpenses] = useState([{ name: "", quantity: null }]);
    const [formValue, setFormValue] = useState({
        work_status: workStatus,
    });
    const data = ["ลาป่วย", "ลาโดยใช้วันหยุด"].map((item) => ({
        label: item,
        value: item,
    }));
    const handleCheckBox = (e) => {
        setCheckBoxed(e);
    };
    const handleChange = (e) => {
        setWorkStatus(e);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleOk = (e, formValue) => {
        if (!formRef.current.check()) {
            return;
        }
        onAddEvent(e, formValue, leaveType);
        setFormValue({ work_status: WorkStatus.COME });
        setLeaveType("");
    };
    console.log("modal leavetype", leaveType);
    console.log("modal leavecause", leaveCause);
    console.log("modal leavereason", leaveReason);
    return (_jsxs(Modal, { open: open, onClose: onClose, backdrop: "static", ...rest, children: [_jsx(Modal.Header, { children: _jsx(Modal.Title, { children: moment(values.start).format("dddd, YYYY MMMM DD") }) }), _jsx(Modal.Body, { children: _jsxs(Form, { fluid: true, ref: formRef, onChange: setFormValue, onCheck: setFormError, children: [_jsxs(Field, { name: "work_status", accepter: RadioGroup, inline: true, value: workStatus, onChange: handleChange, children: [_jsx(Radio, { value: WorkStatus.COME, children: "\u0E21\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19" }), _jsx(Radio, { value: WorkStatus.NOTCOME, children: "\u0E27\u0E31\u0E19\u0E2B\u0E22\u0E38\u0E14\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17" }), _jsx(Radio, { value: WorkStatus.LEAVE, children: "\u0E25\u0E32\u0E07\u0E32\u0E19" })] }), WorkStatus.COME == workStatus && (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-2 pb-1", children: _jsxs(CheckboxGroup, { inline: true, name: "checkbox-group", value: checkBoxed, onChange: (e) => handleCheckBox(e), children: [_jsx(Checkbox, { value: "OT", children: "OT" }), _jsx(Checkbox, { value: "Perdiem", children: "Per Diem" })] }) }), _jsxs(Stack, { spacing: 6, children: [_jsx(InputGroup.Addon, { children: "\u0E40\u0E27\u0E25\u0E32\u0E21\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19" }), _jsx(DatePicker, { placeholder: "\u0E40\u0E27\u0E25\u0E32\u0E21\u0E32\u0E17\u0E33\u0E07\u0E32\u0E19", format: "HH:mm", value: values.start, onChange: (date) => {
                                                setValues({
                                                    ...values,
                                                    start: date,
                                                });
                                            }, hideHours: (hour) => hour < 7 || hour > Number(moment(values.end, "HH:mm")), hideMinutes: (min) => min < 0, name: "start_work" }), _jsx(InputGroup.Addon, { children: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E25\u0E34\u0E01\u0E07\u0E32\u0E19" }), _jsx(DatePicker, { name: "end", placeholder: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E25\u0E34\u0E01\u0E07\u0E32\u0E19", format: "HH:mm", value: values.end, onChange: (date) => {
                                                setValues({
                                                    ...values,
                                                    end: date,
                                                });
                                            } })] })] })), WorkStatus.NOTCOME == workStatus && _jsx(_Fragment, {}), WorkStatus.LEAVE == workStatus && (_jsxs(_Fragment, { children: [_jsxs(Form.Group, { controlId: "leave_cause", children: [_jsx(Form.ControlLabel, { children: "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E01\u0E32\u0E23\u0E25\u0E32" }), _jsx(SelectPicker, { data: data, name: "leave_cause", value: leaveCause, onChange: setLeaveCause })] }), _jsxs(Form.Group, { controlId: "leave_reason", children: [_jsx(Form.ControlLabel, { children: "\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38" }), _jsx(Form.Control, { name: "leave_reason", value: leaveReason, onChange: setLeaveReason })] })] })), _jsx("div", { className: "mt-6", children: _jsx(Button, { appearance: "primary", onClick: (e) => handleOk(e, formValue), children: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01" }) })] }) })] }));
};
export default EventModal;
