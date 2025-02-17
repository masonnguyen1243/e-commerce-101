import { memo } from "react";
import clsx from "clsx";

const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  style,
  fullWidth,
  defaultValue,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id}>{label}</label>}
      <select
        defaultValue={defaultValue}
        className={clsx(
          "form-select text-gray-900",
          fullWidth && "w-full",
          style,
        )}
        id={id}
        {...register(id, validate)}
      >
        <option value="">---CHOOSE---</option>
        {options?.map((el, index) => (
          <option key={index} value={el.code}>
            {el.value}
          </option>
        ))}
      </select>
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(Select);
