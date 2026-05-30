export const mandelboxVert = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`

export const mandelboxFrag = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

#define MAX_STEPS 80
#define MAX_DIST 20.0
#define SURF_DIST 0.001
#define MB_SCALE 2.0

mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

vec2 mandelboxDE(vec3 z0) {
    vec3 z = z0;
    float dr = 1.0;
    float r;
    float trap = 1e10;
    float minR = 1e10;

    for (int i = 0; i < 12; i++) {
        z = clamp(z, -1.0, 1.0) * 2.0 - z;

        r = length(z);
        minR = min(minR, r);
        if (r < 0.5) {
            z *= 4.0;
            dr *= 4.0;
        } else if (r < 1.0) {
            float t2 = 1.0 / (r * r);
            z *= t2;
            dr *= t2;
        }

        z = MB_SCALE * z + z0;
        dr = dr * abs(MB_SCALE) + 1.0;
        trap = min(trap, dot(z, z));
    }

    r = length(z);
    return vec2(r / dr, sqrt(trap));
}

vec2 raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    float trap = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        vec2 d = mandelboxDE(p);
        if (d.x < SURF_DIST) return vec2(t, d.y);
        if (t > MAX_DIST) break;
        t += d.x * 0.75;
        trap = d.y;
    }
    return vec2(-1.0, trap);
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.0005, 0.0);
    return normalize(vec3(
        mandelboxDE(p + e.xyy).x - mandelboxDE(p - e.xyy).x,
        mandelboxDE(p + e.yxy).x - mandelboxDE(p - e.yxy).x,
        mandelboxDE(p + e.yyx).x - mandelboxDE(p - e.yyx).x
    ));
}

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash11(float p) {
    return fract(sin(p * 127.1) * 43758.5453);
}

float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm2(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        v += a * noise2(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

float voronoi(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float d = 1.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++) {
        vec2 n = vec2(float(x), float(y));
        vec2 o = vec2(hash21(ip + n), hash21(ip + n + 100.0));
        o = 0.5 + 0.5 * sin(6.2831 * o + uTime * 0.15);
        d = min(d, length(n + o - fp));
    }
    return d;
}

float voronoiEdge(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float d1 = 1.0;
    float d2 = 1.0;
    vec2 closestCell = vec2(0.0);
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++) {
        vec2 n = vec2(float(x), float(y));
        vec2 o = vec2(hash21(ip + n), hash21(ip + n + 100.0));
        o = 0.5 + 0.5 * sin(6.2831 * o + uTime * 0.15);
        float d = length(n + o - fp);
        if (d < d1) {
            d2 = d1;
            d1 = d;
            closestCell = ip + n;
        } else if (d < d2) {
            d2 = d;
        }
    }
    return d2 - d1;
}

float qinghuaFloral(vec2 p) {
    float petal = 0.0;
    for (int i = 0; i < 6; i++) {
        float angle = float(i) * 0.5236;
        vec2 dir = vec2(cos(angle), sin(angle));
        float d = abs(dot(p, dir));
        float along = dot(p, vec2(-sin(angle), cos(angle)));
        float petalShape = smoothstep(0.25, 0.22, d) * smoothstep(0.0, 0.05, along) * smoothstep(0.5, 0.35, along);
        petal += petalShape;
    }
    petal += smoothstep(0.06, 0.04, length(p));
    return clamp(petal, 0.0, 1.0);
}

float qinghuaScroll(vec2 p) {
    vec2 uv = fract(p);
    float stem = smoothstep(0.02, 0.01, abs(uv.y - 0.5));
    float curl = 0.0;
    for (int i = 0; i < 3; i++) {
        float offset = float(i) * 0.33;
        vec2 center = vec2(offset + 0.15, 0.5 + sin(offset * 6.28) * 0.15);
        float r = length(uv - center);
        curl += smoothstep(0.08, 0.06, r) * 0.5;
    }
    return clamp(stem + curl, 0.0, 1.0);
}

float porcelainPattern(vec3 p) {
    float t = 0.0;

    vec2 uv1 = p.xz * 2.5;
    vec2 cell1 = floor(uv1);
    vec2 local1 = fract(uv1) - 0.5;
    float flowerSeed = hash21(cell1);
    if (flowerSeed > 0.4) {
        float rot = hash21(cell1 + 50.0) * 6.2831;
        float cs = cos(rot), sn = sin(rot);
        vec2 rp = vec2(cs * local1.x - sn * local1.y, sn * local1.x + cs * local1.y);
        float floral = qinghuaFloral(rp * (1.5 + hash21(cell1 + 200.0)));
        t += floral * 0.7;
    } else {
        float scroll = qinghuaScroll(local1 * 2.0);
        t += scroll * 0.4;
    }

    vec2 uv2 = p.xy * 5.0;
    float v2 = voronoi(uv2);
    t += smoothstep(0.04, 0.12, v2) * 0.2;

    float vEdge = voronoiEdge(uv2 * 1.5);
    t += smoothstep(0.05, 0.0, vEdge) * 0.3;

    vec2 uv3 = p.yz * 10.0;
    float v3 = voronoi(uv3);
    t += smoothstep(0.03, 0.08, v3) * 0.15;

    vec2 bp = fract(p.xz * 1.5);
    float bw = 0.015;
    float borderH = smoothstep(bw, bw + 0.005, bp.y) * smoothstep(bw, bw + 0.005, 1.0 - bp.y);
    float borderV = smoothstep(bw, bw + 0.005, bp.x) * smoothstep(bw, bw + 0.005, 1.0 - bp.x);
    float border = borderH * borderV;
    float innerBorder = 1.0 - border;
    float innerLine = smoothstep(0.03, 0.025, min(bp.x, bp.y)) * smoothstep(0.03, 0.025, min(1.0 - bp.x, 1.0 - bp.y));
    innerLine *= border;
    t = mix(t, 1.0, innerLine * 0.6);

    float wave1 = sin(p.x * 15.0 + p.z * 10.0) * sin(p.y * 12.0 + p.z * 8.0);
    t += smoothstep(0.3, 0.6, wave1) * 0.08;

    float wave2 = sin(p.x * 25.0 - p.y * 18.0 + p.z * 20.0);
    t += smoothstep(0.5, 0.7, wave2) * 0.05;

    float crack = fbm2(p.xz * 8.0);
    crack = smoothstep(0.48, 0.5, crack);
    t += crack * 0.1;

    return clamp(t, 0.0, 1.0);
}

float calcAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
        float h = 0.005 + 0.08 * float(i) / 4.0;
        float d = mandelboxDE(p + h * n).x;
        occ += (h - d) * sca;
        sca *= 0.88;
    }
    return clamp(1.0 - 4.0 * occ, 0.0, 1.0);
}

float calcSSS(vec3 p, vec3 n, vec3 rd) {
    float sss = 0.0;
    float sca = 1.0;
    for (int i = 1; i < 4; i++) {
        float h = 0.05 * float(i);
        float d = mandelboxDE(p - rd * h).x;
        sss += d * sca;
        sca *= 0.5;
    }
    return clamp(sss * 2.0, 0.0, 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

    float camDist = 4.2;
    float rotY = (uMouse.x - 0.5) * 1.0 + uTime * 0.015;
    float rotX = (uMouse.y - 0.5) * 0.5 + 0.4;

    vec3 ro = vec3(
        camDist * sin(rotY) * cos(rotX),
        camDist * sin(rotX),
        camDist * cos(rotY) * cos(rotX)
    );

    vec3 ta = vec3(0.0, 0.05, 0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = cross(uu, ww);
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.6 * ww);

    vec3 bgBase = vec3(0.94, 0.93, 0.91);

    vec2 gridUv = gl_FragCoord.xy / uResolution;

    float gx = abs(fract(gridUv.x * 60.0) - 0.5);
    float gy = abs(fract(gridUv.y * 60.0) - 0.5);
    float fineGrid = smoothstep(0.48, 0.5, gx) + smoothstep(0.48, 0.5, gy);

    float gx2 = abs(fract(gridUv.x * 15.0) - 0.5);
    float gy2 = abs(fract(gridUv.y * 15.0) - 0.5);
    float coarseGrid = smoothstep(0.48, 0.5, gx2) + smoothstep(0.48, 0.5, gy2);

    vec3 col = bgBase;
    col -= fineGrid * 0.018;
    col -= coarseGrid * 0.025;

    float paperNoise = fbm2(gridUv * 300.0);
    col -= paperNoise * 0.02;

    float paperFiber = fbm2(gridUv * 800.0 + vec2(42.0, 17.0));
    col -= paperFiber * 0.008;

    vec2 hit = raymarch(ro, rd);

    if (hit.x > 0.0) {
        vec3 p = ro + rd * hit.x;
        vec3 n = getNormal(p);

        vec3 lightDir1 = normalize(vec3(0.6, 1.0, 0.4));
        vec3 lightDir2 = normalize(vec3(-0.4, 0.3, -0.6));

        float diff1 = max(dot(n, lightDir1), 0.0);
        float diff2 = max(dot(n, lightDir2), 0.0) * 0.25;
        float diff = diff1 + diff2;

        float spec1 = pow(max(dot(reflect(rd, n), lightDir1), 0.0), 80.0);
        float spec2 = pow(max(dot(reflect(rd, n), lightDir2), 0.0), 40.0) * 0.3;
        float spec = spec1 + spec2;

        float ao = calcAO(p, n);
        float sss = calcSSS(p, n, rd);
        float fres = pow(1.0 - max(dot(-rd, n), 0.0), 4.0);

        float pattern = porcelainPattern(p);

        vec3 porcelainWhite = vec3(0.94, 0.92, 0.88);
        vec3 porcelainBlue = vec3(0.08, 0.16, 0.32);
        vec3 porcelainMidBlue = vec3(0.14, 0.26, 0.44);
        vec3 porcelainLightBlue = vec3(0.35, 0.48, 0.62);
        vec3 porcelainCobalt = vec3(0.05, 0.10, 0.25);

        vec3 baseColor = mix(porcelainCobalt, porcelainWhite, pattern);

        float midBand = smoothstep(0.3, 0.5, pattern) * smoothstep(0.7, 0.5, pattern);
        baseColor = mix(baseColor, porcelainMidBlue, midBand * 0.4);

        float lightBand = smoothstep(0.5, 0.7, pattern) * smoothstep(0.9, 0.7, pattern);
        baseColor = mix(baseColor, porcelainLightBlue, lightBand * 0.2);

        baseColor = mix(baseColor, porcelainMidBlue, fres * 0.2);

        float sssTint = sss * 0.15;
        baseColor += vec3(0.02, 0.04, 0.06) * sssTint;

        col = baseColor * (0.18 + 0.82 * diff) * ao;

        col += spec * 0.4 * porcelainWhite;

        col += fres * 0.06 * porcelainMidBlue;

        col += sss * 0.03 * vec3(0.9, 0.92, 0.95);

        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(gray), col, 0.35);
    } else {
        float distFog = smoothstep(0.0, 0.8, length(uv));
        col = mix(col, vec3(0.88, 0.87, 0.85), distFog * 0.3);
    }

    vec2 ruv = gridUv - 0.5;
    float regMark = 0.0;
    regMark += smoothstep(0.003, 0.001, abs(ruv.x)) * step(abs(ruv.y), 0.03);
    regMark += smoothstep(0.003, 0.001, abs(ruv.y)) * step(abs(ruv.x), 0.03);
    float cr = length(ruv);
    regMark += smoothstep(0.005, 0.003, abs(cr - 0.03)) * step(cr, 0.035);
    regMark += smoothstep(0.003, 0.001, abs(cr)) * step(cr, 0.003);
    col += regMark * 0.3;

    for (int i = 0; i < 4; i++) {
        float cx = float(mod(float(i), 2.0)) * 0.9 + 0.05;
        float cy = float(i / 2) * 0.9 + 0.05;
        vec2 d = abs(gridUv - vec2(cx, cy));
        float cm = smoothstep(0.003, 0.001, d.x) * step(d.y, 0.04);
        cm += smoothstep(0.003, 0.001, d.y) * step(d.x, 0.04);
        col += cm * 0.3;
    }

    float vig = 1.0 - 0.25 * pow(length(uv * 0.65), 1.5);
    col *= vig;

    float grain = (hash21(gl_FragCoord.xy + fract(uTime * 137.0)) - 0.5) * 0.018;
    col += grain;

    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}
`
