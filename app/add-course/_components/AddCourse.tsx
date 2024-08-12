"use client";
import React, { useRef, useState, TouchEvent, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { CategoryChip } from "./CategoryChip";
import useCopyPasted from "../_hooks/useCopyPasted";
import { Input } from "@/components/common/Input/Input";
import useIsMobile from "./_hooks/useIsMobile";
import { CardForCopiedContent } from "@/components/common/Cards/CardForCopiedContent";
import scheduleApi from "@/apis/schedule/ScheduleApi";
import roomApi from "@/apis/room/RoomApi";
import { useCourseContext } from "@/providers/course-provider";
import originPlaceApi from "@/apis/origin-place/OriginPlaceApi";
import { PlaceAutoCompleteUrlRequest } from "@/apis/origin-place/types/model";
import { PlaceAutoCompleteResponse } from "@/apis/origin-place/types/dto";
import { roomUidStorage } from "@/utils/web-storage/room-uid";
import placeApi from "@/apis/place/PlaceApi";
import { CardWithImageSmall } from "@/components/common/Cards/CardWithImageSmall";
import { ScheduleTypeGroupResponse } from "@/apis/place/types/dto";
export interface PlacesContainerProps {
  placesData: ScheduleTypeGroupResponse;
}

const AddCourse = () => {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const { clipboardText } = useCopyPasted();
  const [autoData, setAutoData] = useState<PlaceAutoCompleteResponse | null>(
    null
  );
  const [currentPlacesData, setCurrentPlacesData] =
    useState<ScheduleTypeGroupResponse | null>(null);
  const [showInput, setShowInput] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const roomUid = searchParams.get("roomUid") || "";
  const {
    roomInfo,
    setRoomInfo,
    categoryList,
    setCategoryList,
    placeInfo,
    isClipboardText,
    setIsClipboardText,
  } = useCourseContext();

  const fetchPlaceData = async (roomUid: string) => {
    try {
      const currentPlaces = await placeApi.getPlaces({ roomUid });
      setCurrentPlacesData(currentPlaces);
      console.log(currentPlaces, "==============");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCoursePageData = async (roomUid: string) => {
    try {
      const currentSchedule = await scheduleApi.readSchedules(roomUid);
      const currentRoom = await roomApi.readRoom(roomUid);
      console.log("Schedules:", currentSchedule);
      setCategoryList(currentSchedule.data.schedules);
      setRoomInfo(currentRoom.data);
      return;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return null;
    }
  };

  const fetchAutoCompleteData = async (url: PlaceAutoCompleteUrlRequest) => {
    try {
      const copiedData = await originPlaceApi.postOriginPlace(url);
      return copiedData;
    } catch (error) {
      console.error("Error fetching copiedData:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchCoursePageData(roomUid);
    fetchPlaceData(roomUid);
    console.log("fetch");
  }, [placeInfo]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isMobile && clipboardText) {
        setShowInput(false);
        setIsClipboardText(true);
        const requestData: PlaceAutoCompleteUrlRequest = {
          url: clipboardText,
        };
        const copiedData = await fetchAutoCompleteData(requestData);
        if (copiedData) {
          setAutoData(copiedData);
        }
      } else {
        setShowInput(true);
      }
    };

    fetchData();
  }, [clipboardText, isMobile]);

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [selectedChip, setSelectedChip] = useState<number | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (sliderRef.current) {
      if (touchStartX - touchEndX > 50) {
        sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
      } else if (touchStartX - touchEndX < -50) {
        sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
      }
    }
  };

  const handleChipClick = (index: number) => {
    setSelectedChip(index === selectedChip ? null : index);
    setSelectedCategory(index === selectedCategory ? null : index);
  };

  const filteredPlaces =
    currentPlacesData?.places?.filter(
      (place) =>
        selectedCategory === null || place.scheduleId === selectedCategory
    ) || [];

  const PlaceContainer: React.FC<PlacesContainerProps> = ({ placesData }) => {
    const { places } = placesData;

    return (
      <div className="flex flex-wrap gap-x-4">
        hjhkjhj
        {places.map((place) => (
          <div key={place.id} className="w-[calc(50%-16px)] mb-4">
            <CardWithImageSmall
              place={place.name}
              link={place.url}
              rating={place.starGrade.toString()}
              reviewCount={100} //임시 data
              images={place.placeImageUrls.contents}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center gap-x-[17px] cursor-pointer px-[20px] py-[11px]">
        <p className="flex w-[232px] text-semibold-15 text-neutral-700">
          {roomInfo?.name}
        </p>

        <Button className="flex border-2 border-[#E7E8EB] w-[86px] h-[34px] py-[8px] px-[12px] bg-white gap-[4px]">
          <p className="font-semibold text-neutral-700 text-[12px]">투표시작</p>
          <Image
            width={16}
            height={16}
            src="/gif/vote_button.gif"
            alt="vote_button.gif"
          />
        </Button>
      </div>
      <div
        className={`flex flex-col px-[20px] w-[335px] ${
          !showInput ? "h-[148px]" : "h-[103px]"
        } mt-[16px]`}
      >
        <div className="flex flex-row w-[224px] font-extrabold h-[31px] text-[22px] mb-[16px]">
          <p className="text-[#FF601C]">투표 후 코스</p>
          <p>를 추천받아요</p>
        </div>
        {showInput ? (
          <div className="flex w-[335px] h-[56px] px-[20px] py-[12px] gap-x-[16px] bg-[#FFF7F2] border-2 border-[#FFF1EB] rounded-[32px] items-center">
            <Input
              className="rounded-none p-0 shadow-none focus:bg-transparent w-[251px] h-[24px] bg-transparent border-none text-[#747B89]"
              placeholder="네이버, 카카오 링크를 넣어주세요"
            />
            <Image
              src={"/png/ic_arrow_left_circle_32.png"}
              alt="arrow"
              width={32}
              height={32}
            />
          </div>
        ) : (
          autoData && (
            <CardForCopiedContent
              name={autoData.data.name}
              url={autoData.data.url}
              placeImageUrls={autoData.data.placeImageUrls}
              starGrade={autoData.data.starGrade}
              reviewCount={autoData.data.reviewCount}
              origin={autoData.data.origin}
            />
          )
        )}
      </div>
      <div
        className="flex flex-row mt-[8px] mx-[20px] w-[335px] h-[37px] items-center py-[8px] pr-[12px]"
        onClick={() =>
          router.push(
            `add-course/detail?roomUid=${roomUidStorage?.get()?.roomUid}`
          )
        }
      >
        <div className="flex flex-row items-center justify-start gap-x-[6px] cursor-pointer">
          <Image
            src={"/png/ic_plus_circle_20.png"}
            alt="plus"
            width={20}
            height={20}
          />
          <p
            className="w-[52px] text-[14px] font-semibold text-[#B5B9C6]"
            onClick={() =>
              router.push(
                `add-course/detail?roomUid=${roomUidStorage?.get()?.roomUid}`
              )
            }
          >
            직접 추가
          </p>
        </div>
      </div>
      <div className="flex w-[375px] h-[12px] bg-[#F9FAFB] my-[20px]" />
      <div className="flex flex-row justify-between items-center">
        <div
          className="flex flex-start pl-[20px] w-full h-[37px] items-center gap-x-[8px] overflow-x-scroll scrollbar-hide"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {categoryList?.map(
            (item) =>
              item.scheduleId &&
              item.name && (
                <CategoryChip
                  key={item.scheduleId}
                  title={item.name}
                  selected={selectedChip === item.scheduleId}
                  onClick={() => handleChipClick(item.scheduleId)}
                />
              )
          )}
        </div>
        <div className="relative flex items-center justify-center w-[64px] h-[37px] mr-[20px] cursor-pointer">
          <div className="absolute left-[-16px] w-[16px] h-full">
            <Image
              src={"/svg/gradient.svg"}
              width={16}
              height={37}
              alt="gradient"
            />
          </div>
          <div className="flex items-center justify-center w-[32px] h-[32px] border-2 border-[#E7E8EB] rounded-[16px]">
            <Image
              src={"/png/ic_arrow_left_right_20.png"}
              alt="plus"
              width={16}
              height={16}
              onClick={() => router.push("/edit-course")}
            />
          </div>
        </div>
      </div>
      {!currentPlacesData || currentPlacesData?.places == null ? (
        <div className="flex flex-col w-full h-full items-center justify-center mt-[64px]">
          <div className="flex flex-col items-center justify-center w-full h-[197px] gap-y-[12px]">
            <div className="flex w-[108px] h-[104px] items-center justify-center">
              <Image
                src={"/png/img_sample.png"}
                alt="sample"
                width={108}
                height={104}
              />
            </div>
            <div className="flex flex-col w-full items-center justify-center text-[14px] text-[#8B95A1]">
              <p className="flex w-full items-center justify-center">
                일행을 초대하고
              </p>
              <p className="flex w-full items-center justify-center">
                함께 장소를 추가하세요
              </p>
            </div>
            <Button className="w-[112px] h-[41px] hover:bg-transparent bg-transparent border-2 gap-x-[4px] rounded-[28px] border-[#FF601C] text-[#FF601C]">
              <Image
                src={"/svg/ic_wrap.svg"}
                alt="wrap"
                width={16}
                height={16}
              />
              <p>일행 초대</p>
            </Button>
          </div>
        </div>
      ) : (
        <PlaceContainer
          placesData={{ ...currentPlacesData, places: filteredPlaces }}
        />
      )}
    </div>
  );
};

export default AddCourse;
