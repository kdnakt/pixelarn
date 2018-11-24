require('../../src/Date')

it('2018/01/01 is week 1',() => {
  const date20180101 = new Date('2018/01/01')
  expect(date20180101.getWeek()).toBe(1)
  expect(date20180101.getWeekYear()).toBe(2018)
})

it('2018/01/06 is week 1',() => {
  const date20180106 = new Date('2018/01/06')
  expect(date20180106.getWeek()).toBe(1)
  expect(date20180106.getWeekYear()).toBe(2018)
})

it('2017/12/31 is week 1',() => {
  const date20171231 = new Date('2017/12/31')
  expect(date20171231.getWeekYear(true)).toBe(2018)
  expect(date20171231.getWeek()).toBe(1)
  expect(date20171231.getWeekYear()).toBe(2018)
})

it('2017/12/30 is week 52',() => {
  const date20171230 = new Date('2017/12/30')
  expect(date20171230.getWeek()).toBe(52)
  expect(date20171230.getWeekYear()).toBe(2017)
})