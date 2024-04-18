export const networkColors = {
  1: 'border-[rgb(68,113,244)]',
  137: 'border-[rgb(113,55,210)]',
  43114: 'border-[rgb(214,60,54)]',
  42161: 'border-[rgb(22,139,217)]',
  56: 'border-[rgb(242,238,147)]',
  250: 'border-[rgb(25,105,255)]',
} as const;

export const colorByChainId = (chaindId: number) => {
  return networkColors[chaindId as keyof typeof networkColors] || 'border-gray-600'
}