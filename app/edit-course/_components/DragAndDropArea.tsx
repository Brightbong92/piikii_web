"use client";
import React, { useMemo, useState } from "react";
import { DragDropContext, DropResult, Draggable } from "react-beautiful-dnd";
import Image from "next/image";
import CardWithCourse from "@/components/common/Cards/CardWithCourse";
import { SheetWithCourse } from "@/components/common/BottomSheet/SheetWithCourse";
import { iconInfo } from "@/lib/utils";
import { StrictModeDroppable } from "./Droppable";

export type OrderType = "food" | "dessert" | "beer" | "play";

export type ValueType = {
  globalIndex: number;
  title: string;
  type: OrderType;
  icon: string;
};

export type ColumnsType = {
  course: {
    id: "course";
    list: Record<OrderType, ValueType[]>;
  };
};

type DragAndDropProps = {
  initialColumns: ColumnsType;
};

const updateColumnsOnDelete = (
  prevColumns: ColumnsType,
  globalIndexToDelete: number
): ColumnsType => {
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

const DragAndDropArea: React.FC<DragAndDropProps> = ({ initialColumns }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [itemCount, setItemCount] = useState(
    Object.values(initialColumns.course.list).flat().length
  );

  const allItems = useMemo(() => {
    return Object.values(columns.course.list)
      .flat()
      .sort((a, b) => a.globalIndex - b.globalIndex);
  }, [columns.course.list]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

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
    setColumns((prevColumns) =>
      updateColumnsOnDelete(prevColumns, globalIndexToDelete)
    );
    setItemCount(itemCount - 1);
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
              {allItems.map((item: ValueType, index: number) => (
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

export default DragAndDropArea;
