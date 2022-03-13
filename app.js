const express = require('express');
const app = express();
const port = 3000;
const DB = require('sqlite-async');
const {rewardDates} = require('./reward')

const main = async () => {
    try {
        db = await DB.open(":memory:");
        
        // I decided to only make table for rewards since the user & the date should be created on the fly on every request
        await db.run('CREATE TABLE IF NOT EXISTS rewards (id_user INTEGER, availableAt TEXT, redeemedAt TEXT, expiresAt TEXT)');
    } catch (error) {
        throw Error('can not access sqlite database', error);
    }

    app.get('/users/:id/rewards', async (req, res) =>{
        if(isNaN(req.params.id))
            return res.status(400).json({error: {message: "the user id should only be number."}})
        
        if(isNaN(Date.parse(req.query.at) ))
            return res.status(400).json({error: {message: "Invalid date value. Please use valid ISO 8601 format for the date value."}})

        try {
            let findReward = await db.get('SELECT id_user FROM rewards WHERE id_user = ?', req.params.id)
            if(!findReward){
                let dateRange = rewardDates(req.query.at)
                rewards = []
                
                for(let i = 0; i<7;i++)
                    rewards.push('(' + [req.params.id, `'${dateRange[i]}'`, "''", `'${dateRange[i+1]}'`].join(',') + ')')
                  
                await db.run(`INSERT INTO rewards (id_user, availableAt, redeemedAt, expiresAt) VALUES ${rewards.join(',')}`, [])
            }

            return res.json({data: await db.all('SELECT availableAt, redeemedAt, expiresAt FROM rewards WHERE id_user = ?', req.params.id)})
                
        } catch (error) {
            res.status(500).json({error: {message: "uh-oh something bad happen on our end!"}})
            throw error
        }
    })

    // development purpose only. use to check on all of the stored rewards.
    app.get('/rewards', async (req, res) => {
        let rewards = await db.all('SELECT * FROM rewards', [])
        res.json(rewards)
    })

    app.patch('/users/:id/rewards/:date/redeem', async (req, res) => {
        let availableDate = req.params.date
        let findReward = await db.get('SELECT * FROM rewards WHERE availableAt = ? AND id_user = ?', 
            [availableDate, req.params.id])

        if(!findReward)
            return res.status(404).json({error: {message: "Cannot found specified reward for specified user."}})

        if(findReward.redeemedAt != '')
            return res.status(400).json({error: {message: "This reward is already claimed!"}})

        if(new Date() < new Date(findReward.availableAt))
            return res.status(400).json({error: {message: "This reward is not yet available!"}})

        if(new Date() > new Date(findReward.expiresAt))
            return res.status(400).json({error: {message: "This reward is already expired!"}})
            
        await db.run(`UPDATE rewards SET redeemedAt = ? where availableAt = ? AND id_user = ?`, 
            [new Date().toISOString().split('.')[0] + 'Z' , availableDate, req.params.id])
        
        res.json({data: await db.get('SELECT * FROM rewards WHERE availableAt = ?', availableDate)})
    })

    app.listen(port, () => console.log(`server listen on port ${port}`));
      
}

main()