import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardInfoProps, CardSizeProps } from "@/model";
import { cn, getSizeClasses } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const CardWithImage: React.FC<CardInfoProps> = ({
  origin,
  place,
  link,
  rating,
  reviewCount,
  images,
  info,
  noShadow,
  cardClassName,
  cardDividerClassName,
  cardButtonClassName,
  customStyle = {},
}) => {
  const originLogoSrc = React.useMemo(
    () =>
      origin === "AVOCADO" ? "/svg/naver-icon.svg" : "/svg/kakao-icon.svg",
    [origin]
  );

  return (
    <Card
      className={cn(
        "flex flex-col items-center max-w-[430px] w-full max-h-[372px] py-[24px] rounded-xl border-0 bg-primary-50",
        noShadow && "shadow-none",
        cardClassName
      )}
      style={customStyle}
    >
      <div className="flex flex-col w-full px-[20px] h-[139px]">
        <div className="flex gap-x-[8px]">
          <CardHeader className="w-full">
            <div className="flex w-full gap-x-[8px] justify-between items-center h-[31px] text-semibold-22">
              <div className="truncate">{place}</div>

              {origin !== "MANUAL" && (
                <div className="flex gap-x-[4px] items-center justify-end min-w-[80px]">
                  <div className="flex w-[16px] h-[16px]">
                    <Image
                      src={originLogoSrc}
                      alt="logo"
                      width={16}
                      height={16}
                      priority
                      unoptimized
                    />
                  </div>
                  <div className="text-[14px]">
                    {rating}
                    {reviewCount ? ` (${reviewCount})` : ""}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
        </div>
        <div className="flex flex-row w-full gap-x-[9px] py-[15px]">
          {images.map((src, index) => (
            <Image
              key={index}
              src={src}
              className="rounded-lg w-[92px] h-[92px]"
              alt={`food${index + 1}`}
              width={92}
              height={92}
              priority
            />
          ))}
        </div>
      </div>

      <div className="px-[20px] w-full mt-[24px]">
        <hr className={cn("w-full bg-primary-100", cardDividerClassName)} />
      </div>

      <CardContent className="flex flex-col w-full px-[20px] h-[161px] gap-y-[8px] my-[20px]">
        {info?.map((item, index) => (
          <div
            key={index}
            className="flex flex-row justify-between w-full h-[21px] gap-x-[16px] text-[14px]"
          >
            <span className="w-[60px]">{item.label}</span>
            <span className="truncate">{item.value}</span>
          </div>
        ))}

        <button
          className={cn(
            "flex flex-row mt-[12px] items-center justify-center w-full h-[42px] bg-primary-150 py-[12px] px-[111px] rounded-2xl gap-x-[4px]",
            cardButtonClassName
          )}
          onClick={() => (link ? window.open(link, "_blank") : null)}
        >
          <div className="h-[18px] opacity-80 text-[12px] font-semibold">
            자세히 보기
          </div>
          <Image
            src="/svg/ic_arrow_right.svg"
            className=""
            alt="arrow_right"
            width={12}
            height={12}
            priority
            unoptimized
          />
        </button>
      </CardContent>
    </Card>
  );
};

export function CardWithLike({ size }: CardSizeProps) {
  const { cardSizeClass, imageSize } = getSizeClasses(size);

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center rounded-xl ",
        cardSizeClass
      )}
    >
      <CardContent>
        <div
          className={cn(
            "flex flex-col items-center justify-center",
            cardSizeClass
          )}
        >
          <Image
            src="/svg/img_like.svg"
            alt="default"
            width={imageSize}
            height={imageSize}
            priority
            unoptimized
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function CardWithDislike({ size }: CardSizeProps) {
  const { cardSizeClass, imageSize } = getSizeClasses(size);

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center rounded-xl ",
        cardSizeClass
      )}
    >
      <CardContent>
        <div
          className={cn(
            "flex flex-col items-center justify-center",
            cardSizeClass
          )}
        >
          <Image
            src="/svg/img_dislike.svg"
            alt="dislike"
            width={imageSize}
            height={imageSize}
            priority
            unoptimized
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CardWithImage;
