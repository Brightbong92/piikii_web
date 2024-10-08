import { Button } from "@/components/common/Button/Button";
import { cn } from "@/lib/utils";
import {
  CategoryChoiceState,
  ColorTheme,
  SwipeDirection,
  VoteType,
} from "../model";
import Image from "next/image";

const ICON_BUTTON_CLASSNAME =
  "bg-neutral-0 !w-[52px] !h-[52px] flex justify-center items-center !p-0 rounded-[18px]" as const;

interface Props {
  voteType: VoteType;
  colorTheme: ColorTheme;
  onClickButton: (direction: SwipeDirection) => void;
}

export default function MotionCardActionButtons({
  voteType,
  colorTheme,
  onClickButton,
}: Props) {
  return (
    <div
      className="flex justify-center items-center gap-x-[8px] relative z-1000"
      style={{}}
    >
      <Button
        className={cn(
          "hover:bg-secondary-dislike-100 active:bg-secondary-dislike-200 relative z-[1000]",
          ICON_BUTTON_CLASSNAME
        )}
        style={{
          boxShadow: colorTheme.style.buttonBoxShadow,
        }}
        onClick={() => onClickButton(SwipeDirection.LEFT)}
      >
        <Image src="/svg/icon-x-mono-red.svg" width={27} height={27} alt="X" />
      </Button>

      {voteType === VoteType.VOTE_PENDING && (
        <Button
          className={cn(
            "text-black-16 hover:bg-neutral-300  group relative z-[1001]",
            ICON_BUTTON_CLASSNAME
          )}
          style={{
            boxShadow: colorTheme.style.buttonBoxShadow,
          }}
          onClick={() => onClickButton(SwipeDirection.UP)}
        >
          <span className="text-neutral-900 text-opacity-70 text-black-16">
            보류
          </span>
        </Button>
      )}

      <Button
        className={cn(
          " hover:bg-secondary-like-100 active:bg-secondary-like-200 relative z-[1002]",
          ICON_BUTTON_CLASSNAME
        )}
        style={{
          boxShadow: colorTheme.style.buttonBoxShadow,
        }}
        onClick={() => onClickButton(SwipeDirection.RIGHT)}
      >
        <Image
          src="/svg/icon-circle-empty-mono.svg"
          width={27}
          height={27}
          alt="O"
        />
      </Button>
    </div>
  );
}
