import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import KanBanBoard, {
  COLUMN_KEY_TODO,
  COLUMN_KEY_ONGOING,
  COLUMN_KEY_DONE,
} from './KanBanBoard';
import AdminContext from '../context/AdminContext';

import './App.css';

const DATA_STORE_KEY = 'kanban-data-store';

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const UPDATE_INTERVAL = MINUTE;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '2022-09-15 21:10' },
    { title: '开发任务-3', status: '2022-05-22 18:15' },
    { title: '开发任务-5', status: '2022-05-22 21:05' },
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: '开发任务-4', status: '2022-05-02 18:15' },
    { title: '开发任务-6', status: '2022-05-22 18:15' },
    { title: '测试任务-2', status: '2022-05-12 18:15' },
  ]);
  const [doneList, setDoneList] = useState([
    { title: '开发任务-9', status: '2022-11-02 21:10' },
    { title: '开发任务-7', status: '2022-11-22 18:15' },
    { title: '开发任务-5', status: '2022-11-22 21:05' },
  ]);
  const updates = {
    [COLUMN_KEY_TODO]: setTodoList,
    [COLUMN_KEY_ONGOING]: setOngoingList,
    [COLUMN_KEY_DONE]: setDoneList,
  };

  const handleToggleAdmin = (evt) => {
    setIsAdmin(!isAdmin);
  };
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
  };

  const handleAdd = (cloumn, draggedItem) => {
    updates[cloumn]((pre) => ([draggedItem, ...pre]));
  };

  const onRemove = (cloumn, cardToRemove) => {
    updates[cloumn]((currentStat) => currentStat.filter((item) => item.title !== cardToRemove.title));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          我的看板
          <button onClick={handleSaveAll}>保存所有卡片</button>
          <label>
            <input type="checkbox" value={isAdmin} onChange={handleToggleAdmin} />
            管理员模式
          </label>
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <AdminContext.Provider value={isAdmin}>
        <KanBanBoard
          isLoading={isLoading}
          todoList={todoList}
          ongoingList={ongoingList}
          doneList={doneList}
          onAdd={handleAdd}
          onRemove={onRemove}
        />
      </AdminContext.Provider>
    </div>
  );
}

export default App;
