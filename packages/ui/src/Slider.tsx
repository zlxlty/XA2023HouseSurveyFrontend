export function Slider({
  value,
  setValue,
  min,
  max,
}: {
  value: number
  setValue: (value: number) => void
  min: number
  max: number
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      setValue(+e.target.value)
    }
  }

  return (
    <input
      className="slider ui-w-full"
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
    />
  )
}
