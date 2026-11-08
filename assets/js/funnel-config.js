/* Funnel + course settings. One place to edit before launch.
   While draft is true: every new page shows a "draft" banner, forms send nothing, and the payment button stays off. */
window.TICO_FUNNEL = {
  draft: true,
  // Link from the card-processing company's hosted payment page (leave empty until it exists).
  paymentUrl: '',
  // Booking page for the fit meeting (leave empty to use the short request form).
  bookingUrl: '',
  courseName: 'שם הקורס (להחלטה)',
  coursePrice: '297',
  // Default YouTube destination; replace per type/topic when the playlists exist.
  youtube: 'https://youtube.com/playlist?list=PLTERUJJXsujA',
  playlists: { flip: '', presale: '', mid: '', long: '', portfolio: '', pinui: '' }
};
