import { css } from '@emotion/react';
import React, { useState } from 'react';
import KanBanColumn from './KanBanColumn';

const kanbanBoardStyles = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;
const columnBgColor = {
  loading: '#E3E3E3',
  todo: '#C9AF97',
  ongoing: '#FFE799',
  done: '#C0E8BA',
};
export const COLUMN_KEY_TODO = 'todo';
export const COLUMN_KEY_ONGOING = 'ongoing';
export const COLUMN_KEY_DONE = 'done';

export default function KanBanBoard({
  onAdd,
  isLoading,
  todoList,
  ongoingList,
  doneList,
  onRemove,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const handleDrop = () => {
    if (!draggedItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return;
    }
    dragSource && onRemove(dragSource, draggedItem);
    dragTarget && onAdd(dragTarget, draggedItem);
  };

  return (
    <main css={kanbanBoardStyles}>
      { isLoading
        ? (
          <KanBanColumn bgColor={columnBgColor.loading} title="处理中" />
        )
        : (
          <KanBanColumn
            bgColor={columnBgColor.todo}
            title="待处理"
            cardList={todoList}
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_TODO : null)}
            setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_TODO : null)}
            handleDrop={handleDrop}
            // eslint-disable-next-line react/jsx-no-bind
            onAdd={onAdd.bind(null, COLUMN_KEY_TODO)}
            canAddNew
            setDraggedItem={setDraggedItem}
          />
        )}
      <KanBanColumn
        bgColor={columnBgColor.ongoing}
        title="进行中"
        setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)}
        setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_ONGOING : null)}
        handleDrop={handleDrop}
        cardList={ongoingList}
        setDraggedItem={setDraggedItem}
      />
      <KanBanColumn
        bgColor={columnBgColor.done}
        title="已完成"
        setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_DONE : null)}
        setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_DONE : null)}
        handleDrop={handleDrop}
        cardList={doneList}
        setDraggedItem={setDraggedItem}
        // eslint-disable-next-line react/jsx-no-bind
        onRemove={onRemove.bind(null, COLUMN_KEY_DONE)}
      />
    </main>
  );
}
