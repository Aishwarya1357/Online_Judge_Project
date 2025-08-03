const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-[#68e5e5]" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-800/70 border border-gray-700 focus:ring-2 focus:ring-cyan-400 outline-none text-white placeholder-gray-400 transition"
      />
    </div>
  );
};

export default Input;