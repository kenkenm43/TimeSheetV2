type Props = {
  message: string;
};
const Topic = ({ message }: Props) => {
  return (
    <div className=" font-bold w-full flex justify-center text-2xl">
      {message}
    </div>
  );
};

export default Topic;
