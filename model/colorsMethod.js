import {Colors} from "./colors";

/*export function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        result = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
        return (result !== null && result['r']*0.299 + result['g']*0.587 + result['b']*0.114<186)? "white" : "black";

}*/

export function colorNameToHex(color)
{
    let colors = Colors;
    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];
    return false;
}