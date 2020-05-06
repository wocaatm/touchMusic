const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

function removePaddingChars (input){
    var lkey = _keyStr.indexOf(input.charAt(input.length - 1));
    if(lkey == 64){
        return input.substring(0,input.length - 1);
    }
    return input;
}

function decode (input, arrayBuffer) {
    //get last chars to see if are valid
    input = removePaddingChars(input);
    input = removePaddingChars(input);

    var bytes = parseInt((input.length / 4) * 3, 10);
    
    var uarray;
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    var j = 0;
    
    if (arrayBuffer)
        uarray = new Uint8Array(arrayBuffer);
    else
        uarray = new Uint8Array(bytes);
    
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
    for (i=0; i<bytes; i+=3) {  
        //get the 3 octects in 4 ascii chars
        enc1 = _keyStr.indexOf(input.charAt(j++));
        enc2 = _keyStr.indexOf(input.charAt(j++));
        enc3 = _keyStr.indexOf(input.charAt(j++));
        enc4 = _keyStr.indexOf(input.charAt(j++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        uarray[i] = chr1;           
        if (enc3 != 64) uarray[i+1] = chr2;
        if (enc4 != 64) uarray[i+2] = chr3;
    }

    return uarray;  
}

export default (input) => {
    var bytes = (input.length/4) * 3;
    var ab = new ArrayBuffer(bytes);
    decode(input, ab);
    
    return ab;
}