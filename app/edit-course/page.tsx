"use client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
  DroppableProps,
} from "react-beautiful-dnd";
import Image from "next/image";
import CardWithCourse from "@/components/common/Cards/CardWithCourse";
import { SheetWithCourse } from "@/components/common/BottomSheet/SheetWithCourse";
import { iconInfo } from "@/lib/utils";

export type OrderType = "food" | "dessert" | "beer" | "play";

export type ValueType = {
  globalIndex: number;
  title: string;
  type: OrderType;
  icon: string;
};

export interface Column {
  id: string;
  list: Record<OrderType, ValueType[]>;
}

export interface Columns {
  [key: string]: Column;
}

// 사용자가 설정한 데이터라고 가정
const initialColumns: Columns = {
  course: {
    id: "course",
    list: {
      food: [
        { globalIndex: 0, title: "음식", type: "food", icon: "🍔" },
        { globalIndex: 2, title: "음식", type: "food", icon: "🍔" },
      ],
      dessert: [
        { globalIndex: 1, title: "디저트", type: "dessert", icon: "🥨" },
      ],
      beer: [],
      play: [],
    },
  },
};

const reorder = (
  list: ValueType[],
  startIndex: number,
  endIndex: number
): ValueType[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);
  return result;
};

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const EditCoursePage = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [itemCount, setItemCount] = useState(
    Object.values(initialColumns.course.list).flat().length
  );

  const getAllItems = (): ValueType[] => {
    return Object.values(columns.course.list)
      .flat()
      .sort((a, b) => a.globalIndex - b.globalIndex);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const allItems = getAllItems();
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const reorderedItems = reorder(allItems, sourceIndex, destinationIndex);

    const newColumns = { ...columns };
    const newList: Record<OrderType, ValueType[]> = {
      food: [],
      dessert: [],
      beer: [],
      play: [],
    };

    reorderedItems.forEach((item, index) => {
      item.globalIndex = index;
      newList[item.type].push(item);
    });

    newColumns.course.list = newList;
    setColumns(newColumns);
  };

  const handleItemDelete = (globalIndexToDelete: number) => {
    setColumns((prevColumns) => {
      const updatedList: Record<OrderType, ValueType[]> = {
        food: [],
        dessert: [],
        beer: [],
        play: [],
      };

      Object.values(prevColumns.course.list)
        .flat()
        .forEach((item) => {
          if (item.globalIndex !== globalIndexToDelete) {
            updatedList[item.type].push(item);
          }
        });

      return {
        ...prevColumns,
        course: {
          ...prevColumns.course,
          list: updatedList,
        },
      };
    });
    setItemCount((prevCount) => prevCount - 1);
  };

  const handleItemClick = (type: OrderType) => {
    const icon = iconInfo.find((item) => item.type === type);
    if (!icon) return;

    const newItem = {
      globalIndex: itemCount,
      title: `${icon.label}`,
      type: icon.type,
      icon: icon.icon,
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      course: {
        ...prevColumns.course,
        list: {
          ...prevColumns.course.list,
          [type]: [...prevColumns.course.list[type], newItem],
        },
      },
    }));
    setItemCount(itemCount + 1);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-y-[16px]"
            >
              {getAllItems().map((item: ValueType, index: number) => (
                <Draggable
                  key={item.globalIndex}
                  draggableId={`item-${item.type}-${item.globalIndex}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="flex flex-row items-center justify-center w-[335px] h-[56px] gap-x-[16px]"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Image
                        src="/svg/ic_x.svg"
                        alt="x"
                        width={16}
                        height={16}
                        priority
                        unoptimized
                        onClick={() => handleItemDelete(item.globalIndex)}
                      />
                      <CardWithCourse item={item} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      {itemCount < 5 && <SheetWithCourse handleItemClick={handleItemClick} />}
    </>
  );
};

export default EditCoursePage;
