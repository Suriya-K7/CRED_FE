export default function InputSection({
  title,
  no,
  flag,
}: {
  title: string;
  no: number;
  flag: boolean;
}) {
  return (
    <div className="flex relative pl-16 text-white ">
      <div
        className={`absolute left-6 top-2 w-6 h-6 flex text-xs items-center justify-center rounded-full duration-150 ${
          flag ? "bg-red-600 " : "bg-gray-300"
        }`}
      >
        {no}
      </div>
      <div className="flex-1 bg-[#601a78] font-medium text-xl px-4 py-2 rounded-md">
        {title}
      </div>
    </div>
  );
}
