import { useState, useEffect } from "react";

export default function IframePage() {

    const iframeSrc = "https://dda.wjcwjcwjc.icu";

    return (
        <div className="w-full h-full">
                <iframe
                    src={iframeSrc}
                    allow="microphone; camera"
                    className="w-full h-[95%] border-none"
         
                />
        </div>
    );
}