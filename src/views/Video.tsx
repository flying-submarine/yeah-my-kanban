// AICallUIComponent.tsx
import React, { useEffect, useRef } from 'react';

const AICallUIComponent = () => {

  const rootDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 确保脚本加载完成后再初始化组件
    const script = document.createElement('script');
    script.src = "https://g.alicdn.com/apsara-media-aui/amaui-web-aicall/1.6.2/aicall-ui.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (rootDiv.current) {
        new window.ARTCAICallUI({
          userId: '123',                          // 进入rtc的用户id，建议使用业务的登录用户id
          root: rootDiv.current,                  // 页面渲染到的节点，画面完整填充整个区域
          shareToken: 'eyJSZXF1ZXN0SWQiOiJERTI1Njk2RS1CQTk5LTMyQUItQTQ1MC0zNzA4MjFERURFNDUiLCJXb3JrZmxvd1R5cGUiOiJWb2ljZUNoYXQiLCJUZW1wb3JhcnlBSUFnZW50SWQiOiIzM2I2ZTIzMTExZmY0YTdiOGJkYjU4ZTViNTcwYzZhMSIsIkV4cGlyZVRpbWUiOiIyMDI1LTAzLTIzIDE2OjEzOjAxIiwiTmFtZSI6IjMzYjZlMjMxMTFmZjRhN2I4YmRiNThlNWI1NzBjNmExIiwiUmVnaW9uIjoiYXAtc291dGhlYXN0LTEifQ==', // Keep original token
        }).render();
      }
    };

    return () => {
      // 清理工作，例如移除脚本或销毁组件实例
      document.body.removeChild(script);
    };
  }, []); // 依赖数组为空，确保只在组件挂载和卸载时执行

  return <div ref={rootDiv} id="root"></div>;
};

export default AICallUIComponent;