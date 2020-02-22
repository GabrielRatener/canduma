/*!
 * Credit where credit is due:
 *
 * sha256-es
 * https://github.com/logotype/es-crypto.git
 *
 * Copyright 2017 Victor Norgren
 * Released under the MIT license
 * 
 * Modified and made awesome by Gabriel Ratener
 */

export const hash = (string) => {
    return stringToHex(arrayToString(run(stringToArray(string), string.length * 8)));
}

const run = (input, len) => {
    const K = [
        1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
        3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
        3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
        2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
        666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
        2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
        430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
        1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298
    ];
    const l = (len + 64 >> 9 << 4) + 15;
    const W = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let i = 0,
        H0 = 1779033703,
        H1 = -1150833019,
        H2 = 1013904242,
        H3 = -1521486534,
        H4 = 1359893119,
        H5 = -1694144372,
        H6 = 528734635,
        H7 = 1541459225,
        a = H0,
        b = H1,
        c = H2,
        d = H3,
        e = H4,
        f = H5,
        g = H6,
        h = H7;

    input[len >> 5] |= 0x80 << 24 - len % 32;
    input[l] = len;

    for (; i < l; i += 16) {
        H0 = a;
        H1 = b;
        H2 = c;
        H3 = d;
        H4 = e;
        H5 = f;
        H6 = g;
        H7 = h;

        let j = 0,
            T1 = null, T2 = null;

        for (; j < 64; j += 1) {
            if (j < 16) {
                W[j] = input[j + i];
            } else {
                W[j] = add(add(add(gamma1256(W[j - 2]), W[j - 7]), gamma0256(W[j - 15])), W[j - 16]);
            }

            T1 = add(add(add(add(h, sigma1256(e)), ch(e, f, g)), K[j]), W[j]);
            T2 = add(sigma0256(a), maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = add(d, T1);
            d = c;
            c = b;
            b = a;
            a = add(T1, T2);
        }

        a = add(a, H0);
        b = add(b, H1);
        c = add(c, H2);
        d = add(d, H3);
        e = add(e, H4);
        f = add(f, H5);
        g = add(g, H6);
        h = add(h, H7);
    }
    return [a, b, c, d, e, f, g, h];
}

const arrayToString = (input) => {
    const l = input.length * 32;
    let i = 0,
        output = '';

    for (; i < l; i += 8) {
        output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 0xFF);
    }
    return output;
}

const stringToArray = (input) => {
    const l = input.length * 8;
    const output = Array(input.length >> 2);
    const lo = output.length;
    let i = 0;

    for (; i < lo; i += 1) {
        output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << 24 - i % 32;
    }
    return output;
}

const stringToHex = (input) => {
    const hex = '0123456789abcdef';
    const l = input.length;
    let output = '',
        x = null, i = 0;

    for (; i < l; i += 1) {
        x = input.charCodeAt(i);
        output += hex.charAt(x >>> 4 & 0x0F) + hex.charAt(x & 0x0F);
    }
    return output;
}

const rotl = (X, n) => {
    return X >>> n | X << 32 - n;
}

const rotr = (X, n) => {
    return X >>> n;
}

const ch = (x, y, z) => {
    return x & y ^ ~x & z;
}

const maj = (x, y, z) => {
    return x & y ^ x & z ^ y & z;
}

const sigma0256 = (x) => {
    return rotl(x, 2) ^ rotl(x, 13) ^ rotl(x, 22);
}

const sigma1256 = (x) => {
    return rotl(x, 6) ^ rotl(x, 11) ^ rotl(x, 25);
}

const gamma0256 = (x) => {
    return rotl(x, 7) ^ rotl(x, 18) ^ rotr(x, 3);
}

const gamma1256 = (x) => {
    return rotl(x, 17) ^ rotl(x, 19) ^ rotr(x, 10);
}

const add = (x, y) => {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
}
