import { css } from '@emotion/react';
import { useState } from 'react';
import KanbanCard from './KanbanCard';
import KanbanNewCard from './KanbanNewCard';

export default function KanBanColumn({
  children,
  bgColor,
  title,
  setIsDragSource = () => { },
  setIsDragTarget = () => { },
  handleDrop,
  cardList = [],
  setDraggedItem,
  canAddNew = false,
  onAdd,
  onRemove,
}) {
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    setShowAdd(true);
  };
  const handleSubmit = (newCard) => {
    onAdd && onAdd(newCard);
    setShowAdd(false);
  };
  return (
    <section
      onDragStart={() => setIsDragSource(true)}
      onDragOver={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
        setIsDragTarget(true);
      }}
      onDragLeave={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'none';
        setIsDragTarget(false);
      }}
      onDrop={(evt) => {
        evt.preventDefault();
        handleDrop && handleDrop(evt);
      }}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      css={KanBanColumnStyle(bgColor)}
    >
      <h2>
        {title}
        {canAddNew
        && (
        <button onClick={handleAdd} disabled={showAdd}>
          ⊕ 添加新卡片
        </button>
        )}
      </h2>
      <ul>
        {children}
        {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
        {cardList.map((props) => (
          <KanbanCard
            onDragStart={() => setDraggedItem && setDraggedItem(props)}
            {...props}
            onRemove={onRemove}
            key={props.title}
          />
        )) }
      </ul>

    </section>
  );
}
function KanBanColumnStyle(bgColor) {
  return css`
        flex: 1 1;
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: 1rem;
        background-color: ${bgColor};
        & > ul {
          flex: 0px;
          margin: 1rem;
          padding: 0;
          overflow: auto;
        }
        & > h2 {
          margin: 0.6rem 1rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid gray;
          & > button { 
            float: right; 
            margin-top: 0.2rem;
            padding: 0.2rem 0.5rem; 
            border: 0; 
            border-radius: 1rem; 
            height: 1.8rem; 
            line-height: 1rem; 
            font-size: 1rem;} 
        }
      `;
}
