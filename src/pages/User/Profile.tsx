const Profile = () => {
  const [username, setUsername] = useState<string>("Na");
  const [fistName, setFirstName] = useState<string>("Wa");
  const [lastName, setLastName] = useState<string>("La");
  const [idCard, setIdCard] = useState<string>("1422");
  return (
    <div className="flex flex-col">
      <span>ชื่อผู้ใช้งาน: {username}</span>
      <span>ชื่อจริง: {fistName}</span>
      <span>นามสกุล: {lastName}</span>
      <span>เลขบัตรประชาชน: {idCard}</span>
      <span>เริ่มทำงาน 1/1/2567</span>
      <span>วันที่ผ่านโปร</span>
      <span>เงินสะสม</span>
      <span>วันลาคงเหลือ</span>
    </div>
  );
};

export default Profile;
