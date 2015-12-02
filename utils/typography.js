import Typography from 'typography';

const options = {
  baseFontSize: '18px',
  baseLineHeight: '27px',
  headerFontFamily: '"Lato", "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
  bodyFontFamily: '"Lato", "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
  bodyWeight: 300,
  headerWeight: 700,
  boldWeight: 700,
  modularScales: [
    {
      "scale": "diminished fourth"
    }
  ]
}

const typography = new Typography(options)

// Hot reload typography in development.
if (process.env.NODE_ENV !== "production") {
  typography.injectStyles()
}

export default typography
