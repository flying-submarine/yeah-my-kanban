import React, { useEffect, useRef } from 'react';

const AICallUIComponent = () => {
    const rootDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!rootDiv.current) return;

        const script = document.createElement('script');
        // script.src = "./aicall-ui.js"; // 替换为实际路径
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (rootDiv.current && window.ARTCAICallUI) {
                new window.ARTCAICallUI({
                    userId: '123',
                    root: rootDiv.current,
                    shareToken: 'eyJSZXF1ZXN0SWQiOiI4ODdCMDU3Ri04MDg2LTNGQkYtQTdGRS03NkM1Q0FCRUY2QzMiLCJXb3JrZmxvd1R5cGUiOiJWb2ljZUNoYXQiLCJUZW1wb3JhcnlBSUFnZW50SWQiOiJjZjFkOGFmZGM0ZGY0NWVlOGEwZDBlY2UxYWU1ZjQwNCIsIkV4cGlyZVRpbWUiOiIyMDI1LTAzLTI5IDAzOjMwOjQ2IiwiTmFtZSI6ImNmMWQ4YWZkYzRkZjQ1ZWU4YTBkMGVjZTFhZTVmNDA0IiwiUmVnaW9uIjoiYXAtc291dGhlYXN0LTEifQ==', // Keep original token
                }).render();
            } else {
                console.error('ARTCAICallUI is not defined');
            }
        };

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return <div ref={rootDiv} id="root" style={{ width: '375px', height: '648px' }}></div>;
};

export default AICallUIComponent;