import React from 'react'
import CopyToClipboard from "./CopyToClipboard.jsx"

class RoomLink extends React.Component {
    render () {
        let copyToClipboardBtn = <button>Copy to clipboard</button>
        let copyToClipboardSuccess = <button>Copied to clipboard</button>
        let copyToClipboardError = <button>Error</button>
        if (this.props.roomId !== null) {
            let shareLink = window.location.protocol + "//" + window.location.hostname + window.location.pathname + '?roomKey=' + this.props.roomId
            return (
                <p>
                    Share Link: <input id="room-link" type="text" readOnly value={shareLink} size="50"/>
                    <CopyToClipboard text={shareLink} copyChildren={copyToClipboardBtn}
                                     successChildren={copyToClipboardSuccess}
                                     errorChildren={copyToClipboardError}/>
                </p>
            )
        }
        return (<div></div>)
    }
}

export default RoomLink
