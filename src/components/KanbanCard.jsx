import React, { useState, useEffect, useContext } from 'react';
import { css } from '@emotion/react';
import AdminContext from '../context/AdminContext';
import {
  MINUTE, HOUR, DAY, UPDATE_INTERVAL,
} from './App';

const kanbanCardStylesTime = css`
  text-align: right;
  font-size: 0.8rem;
  color: #333;`;
const kanbanCardStylesTitle = css`
  min-height: 3rem;
`;
const kanbanCardStyles = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;
  &:hover{
    box-shadow: 0 0.2rem 0.2rem rgba(0,0,0,0.2),inset 0 1px #fff;
  }
`;
export default function KanbanCard({
  title, status, onDragStart, onRemove,
}) {
  const [displayTime, setDisplayTime] = useState(status);
  const isAdmin = useContext(AdminContext);

  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status);
      let relativeTime = '刚刚';
      if (MINUTE <= timePassed && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (HOUR <= timePassed && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (DAY <= timePassed) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }
      setDisplayTime(relativeTime);
    };
    const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();

    return function cleanup() {
      clearInterval(intervalId);
    };
  }, [status]);

  const handleDragStart = (evt) => {
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/plain', title);
    onDragStart && onDragStart();
  };
  return (
    <li css={kanbanCardStyles} draggable onDragStart={handleDragStart}>
      <div css={kanbanCardStylesTitle}>{title}</div>
      <div css={kanbanCardStylesTime} title={status}>
        {displayTime}
        {isAdmin && onRemove && <button onClick={() => onRemove({ title })}>X</button>}
      </div>
    </li>
  );
}
