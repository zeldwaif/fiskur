/**
 * Minimal, dependency-free EXIF reader for JPEG files.
 *
 * Only two things are extracted, because only two things are needed: where the photo was
 * taken (GPS) and when (DateTimeOriginal). Everything else in EXIF is ignored.
 *
 * Why hand-rolled instead of a library: this needs to run on the original File *before*
 * the canvas downscale in photo.ts, which strips metadata entirely. Keeping it to ~120
 * lines with no new dependency means `npm install` isn't a prerequisite for the feature.
 *
 * Structure being parsed: JPEG segments → APP1 marker (0xFFE1) → "Exif\0\0" → a TIFF
 * header → IFD0 → pointers to the Exif sub-IFD and the GPS sub-IFD.
 */

export interface ExifData {
  /** Decimal degrees, if the photo carried GPS tags. */
  lat?: number;
  lng?: number;
  /** Local capture time from DateTimeOriginal. */
  takenAt?: Date;
}

/** Byte size per EXIF field type, indexed by the type id used in an IFD entry. */
const TYPE_SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

const TAG_EXIF_IFD = 0x8769;
const TAG_GPS_IFD = 0x8825;
const TAG_DATETIME_ORIGINAL = 0x9003;
const TAG_GPS_LAT_REF = 0x0001;
const TAG_GPS_LAT = 0x0002;
const TAG_GPS_LNG_REF = 0x0003;
const TAG_GPS_LNG = 0x0004;

interface Entry {
  type: number;
  count: number;
  /** Absolute offset into the DataView where this entry's value bytes start. */
  offset: number;
}

function readIfd(view: DataView, tiffStart: number, ifdOffset: number, le: boolean): Map<number, Entry> {
  const out = new Map<number, Entry>();
  if (ifdOffset + 2 > view.byteLength) return out;
  const count = view.getUint16(ifdOffset, le);
  for (let i = 0; i < count; i++) {
    const e = ifdOffset + 2 + i * 12;
    if (e + 12 > view.byteLength) break;
    const tag = view.getUint16(e, le);
    const type = view.getUint16(e + 2, le);
    const cnt = view.getUint32(e + 4, le);
    const total = (TYPE_SIZES[type] ?? 0) * cnt;
    // Values of 4 bytes or fewer are stored inline in the entry itself.
    const offset = total <= 4 ? e + 8 : tiffStart + view.getUint32(e + 8, le);
    out.set(tag, { type, count: cnt, offset });
  }
  return out;
}

function readAscii(view: DataView, entry: Entry): string {
  let s = "";
  for (let i = 0; i < entry.count; i++) {
    if (entry.offset + i >= view.byteLength) break;
    const code = view.getUint8(entry.offset + i);
    if (code === 0) break;
    s += String.fromCharCode(code);
  }
  return s;
}

function readRationals(view: DataView, entry: Entry, le: boolean): number[] {
  const out: number[] = [];
  for (let i = 0; i < entry.count; i++) {
    const at = entry.offset + i * 8;
    if (at + 8 > view.byteLength) break;
    const num = view.getUint32(at, le);
    const den = view.getUint32(at + 4, le);
    out.push(den === 0 ? 0 : num / den);
  }
  return out;
}

/** EXIF stores coordinates as [degrees, minutes, seconds] plus a N/S/E/W reference. */
function toDecimal(parts: number[], ref: string): number | undefined {
  if (parts.length < 3) return undefined;
  const [d, m, s] = parts;
  const value = d + m / 60 + s / 3600;
  if (!Number.isFinite(value)) return undefined;
  const negative = ref === "S" || ref === "W";
  return negative ? -value : value;
}

/** "YYYY:MM:DD HH:MM:SS" — EXIF has no timezone, so this is read as local time. */
function parseExifDate(raw: string): Date | undefined {
  const m = raw.trim().match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return undefined;
  const [, y, mo, d, h, mi, s] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseTiff(view: DataView, tiffStart: number): ExifData {
  if (tiffStart + 8 > view.byteLength) return {};
  const byteOrder = view.getUint16(tiffStart);
  let le: boolean;
  if (byteOrder === 0x4949) le = true;
  else if (byteOrder === 0x4d4d) le = false;
  else return {};
  if (view.getUint16(tiffStart + 2, le) !== 42) return {};

  const ifd0 = readIfd(view, tiffStart, tiffStart + view.getUint32(tiffStart + 4, le), le);
  const result: ExifData = {};

  const exifPtr = ifd0.get(TAG_EXIF_IFD);
  if (exifPtr) {
    const exifIfd = readIfd(view, tiffStart, tiffStart + view.getUint32(exifPtr.offset, le), le);
    const dt = exifIfd.get(TAG_DATETIME_ORIGINAL);
    if (dt && dt.type === 2) result.takenAt = parseExifDate(readAscii(view, dt));
  }

  const gpsPtr = ifd0.get(TAG_GPS_IFD);
  if (gpsPtr) {
    const gps = readIfd(view, tiffStart, tiffStart + view.getUint32(gpsPtr.offset, le), le);
    const latE = gps.get(TAG_GPS_LAT);
    const lngE = gps.get(TAG_GPS_LNG);
    const latRefE = gps.get(TAG_GPS_LAT_REF);
    const lngRefE = gps.get(TAG_GPS_LNG_REF);
    if (latE && lngE && latRefE && lngRefE) {
      const lat = toDecimal(readRationals(view, latE, le), readAscii(view, latRefE));
      const lng = toDecimal(readRationals(view, lngE, le), readAscii(view, lngRefE));
      if (lat != null && lng != null) {
        result.lat = lat;
        result.lng = lng;
      }
    }
  }

  return result;
}

/**
 * Reads EXIF from a JPEG. Returns an empty object for any file that isn't a JPEG, has no
 * EXIF, or is malformed — this is a best-effort signal, never a hard requirement, so it
 * must degrade quietly rather than throw.
 */
export async function readExif(file: File): Promise<ExifData> {
  try {
    const view = new DataView(await file.arrayBuffer());
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return {};

    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      const marker = view.getUint16(offset);
      if ((marker & 0xff00) !== 0xff00) break;
      if (marker === 0xffda) break; // start of image data — no EXIF beyond here
      const size = view.getUint16(offset + 2);
      if (marker === 0xffe1) {
        const app1 = offset + 4;
        // "Exif\0\0"
        if (
          app1 + 6 <= view.byteLength &&
          view.getUint32(app1) === 0x45786966 &&
          view.getUint16(app1 + 4) === 0x0000
        ) {
          return parseTiff(view, app1 + 6);
        }
      }
      if (size < 2) break;
      offset += 2 + size;
    }
    return {};
  } catch {
    return {};
  }
}
