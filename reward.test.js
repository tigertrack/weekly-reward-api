const {rewardDates} = require('./reward') 

describe('rewardDates should', () => {
    
    it('throw error on invalid (NaN) date parameter', () => {
        expect(() => {rewardDates('trigger error')}).toThrowError(new Error('parameter is not a valid date!'))
    })
    
    it('return array of 8 dates', () => {
        expect(rewardDates(new Date())).toHaveLength(8)
    })

    it('return array of dates, all starting at 0 hour', () => {
        // given list of dates
        let list = rewardDates(new Date())

        // take all of the hours and do assertion
        expect(list.map(e => new Date(e).getUTCHours())).toEqual(Array(8).fill(0))
    })

    it('return date of previous month if month dont start in sunday', () => {
        // given a date
        let testDate = new Date()

        // is in february
        testDate.setMonth(1)

        // the first
        testDate.setUTCDate(1)

        // find the week range
        let range = rewardDates(testDate)

        // the first day of the week should be in the previous month (month - 1)
        expect(new Date(range[0]).getMonth()).toEqual(testDate.getUTCMonth() - 1)
    })

    it('return date of next month if month dont end in saturday', () => {
        // given a date
        let testDate = new Date()

        // is in march
        testDate.setMonth(2)

        // the 30th
        testDate.setUTCDate(30)

        // find the week range
        let range = rewardDates(testDate)

        // the last day of the week should be in the next month (month + 1)
        expect(new Date(range[7]).getMonth()).toEqual(testDate.getUTCMonth() + 1)
    })
})