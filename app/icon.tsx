import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Favicon: the conic-gradient "K" mark from the navbar, rendered as a static SVG. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #58ecff, #5377ff 50%, #9c64ff)',
          color: '#041018',
          fontSize: 40,
          fontWeight: 900,
          borderRadius: 14,
        }}
      >
        K
      </div>
    ),
    { ...size },
  );
}