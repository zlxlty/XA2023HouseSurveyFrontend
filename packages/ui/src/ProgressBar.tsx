interface Props {
  percentage: number
  colors?: string[]
}

export const ProgressBar = ({ percentage, colors }: Props) => {
  return (
    <div className="ui-relative ui-overflow-hidden ui-w-full ui-h-full">
      <img
        className="ui-absolute ui-left-0 ui-top-1/2 -ui-translate-y-1/2 ui-z-10 ui-object-cover ui-w-full"
        src="/progress-bar.png"
        alt="Progress Bar Background"
        draggable="false"
      />
      <div className="ui-absolute ui-left-5 ui-top-1/2 -ui-translate-y-1/2 ui-w-[6rem] ui-h-[3.1rem] ui-z-0 ui-bg-[#C5BAF4] ui-rounded-full"></div>
    </div>
  )
}

/* Rectangle 75 */

// position: absolute;
// width: 199px;
// height: 49px;

// background: #C5BAF4;
// border-radius: 66px;
