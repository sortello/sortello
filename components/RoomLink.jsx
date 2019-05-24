import React from 'react'
import CopyToClipboard from "./CopyToClipboard.jsx"

export default ({roomId, extId, BoardApi}) => {
    const copyToClipboardBtn = <button>Copy to clipboard</button>
    const copyToClipboardSuccess = <button>Copied to clipboard</button>
    const copyToClipboardError = <button>Error</button>

    if (roomId !== null) {
        let shareLink = window.location.protocol + "//" + window.location.hostname + port + window.location.pathname +
            '?roomKey=' + roomId + "&extId=" + extId + "&fw=" + (BoardApi.getShortenedExtension());
        return (
            <div className="share-link__container">
                <input className="share-room__input" id="room-link" type="text" readOnly value={shareLink}/>
                <div className="copy-to-clipboard__button">
                    <CopyToClipboard text={shareLink} copyChildren={copyToClipboardBtn}
                                     successChildren={copyToClipboardSuccess}
                                     errorChildren={copyToClipboardError}/>
                </div>
            </div>
        )
    } else {
        return (<div/>)
    }
}