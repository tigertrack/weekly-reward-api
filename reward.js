module.exports = {
    rewardDates: (date) => {
        if(isNaN(Date.parse(date) )){
            throw new Error('parameter is not a valid date!') 
        }
            
        let current = new Date(date)
        current.setUTCHours(0,0,0,0)
        
        current.setUTCDate(current.getUTCDate() - current.getUTCDay())
    
        let rewardDates = [current.toISOString().split('.')[0] + 'Z']

        for(let i = 0; i < 7; i++){
            current.setUTCDate(current.getUTCDate()+1)
            rewardDates.push(current.toISOString().split('.')[0] + 'Z')
        }

        return rewardDates
    }
}