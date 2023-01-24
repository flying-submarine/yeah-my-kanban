import { useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';

const kanbanCardStylesTitle = css`
  min-height: 3rem;
`;
const KanbanNewCardStyleInput = css`
  ${kanbanCardStylesTitle}
  & > input[type="text"]{
      width: 80%;
  }
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
export default function KanbanNewCard({ onSubmit }) {
  const [title, setTitle] = useState('');
  const inputElem = useRef(null);
  const handleChange = (evt) => {
    setTitle(evt.target.value);
  };
  useEffect(() => {
    inputElem.current.focus();
  }, []);
  const handleKeyDown = (evt) => {
    if (evt.key === 'Enter') {
      const newCard = { title, status: new Date().toDateString() };
      onSubmit(newCard);
    }
  };
  return (
    <li css={kanbanCardStyles}>
      <h3>添加新卡片</h3>
      <div css={KanbanNewCardStyleInput}>
        <input
          type="text"
          value={title}
          ref={inputElem}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </li>
  );
}
