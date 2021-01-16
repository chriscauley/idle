import Task from '../../client/task/model'

const now = new Date().valueOf()
const HOUR = 1000 * 3600
const DAY = HOUR * 24

// in all these cases, completed then started then due should have priority and the others ignored
const timeTasks = [
  { name: 'overdue', due: now - HOUR },
  { name: 'due soon', due: now + HOUR },
  { name: 'started', started: now - HOUR, due: now - HOUR },
  {
    name: 'completed',
    completed: now - DAY,
    due: now - 2 * HOUR,
    started: now - HOUR,
  },
]

test('getIcon', () => expect(timeTasks.map(Task.getIcon)).toMatchSnapshot())
test('getTime', () => expect(timeTasks.map(Task.getTime)).toMatchSnapshot())
test('getShortMeasure', () => {
  const activity = { measurements: ['milk', 'eggs', 'cheese'] }
  const task = { milk: 5, eggs: 0 }
  expect(Task.getShortMeasures({ activity, task })).toMatchSnapshot()
})

test('sortByDate', () => {
  const permArr = []
  const usedChars = []

  function permute(input) {
    let i, ch
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0]
      usedChars.push(ch)
      if (input.length === 0) {
        permArr.push(usedChars.slice())
      }
      permute(input)
      input.splice(i, 0, ch)
      usedChars.pop()
    }
    return permArr
  }
  const [ans, ...rest] = permute([...timeTasks]).map((tasks) =>
    Task.sortByDate(tasks)
      .map((t) => t.name)
      .join('|'),
  )
  expect(ans).toMatchSnapshot()
  expect(rest.length).toEqual(23)
  rest.forEach((s) => expect(s).toEqual(ans))
})
