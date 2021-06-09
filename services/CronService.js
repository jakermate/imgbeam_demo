const cron = require('cron').CronJob
const chalk = require('chalk')
const Gallery = require('../db/models/gallery.model')
const GalleryService = require('../services/GalleryService')
const GS = new GalleryService()
const User = require('../db/models/user.model')
function Cron(){
    console.log(chalk.green('Setting up jobs'))

    // handle upload limit decreases
    const limitJob = new cron('1 * * * * *', ()=>{
        // console.log('Limit job running.')
        User.decrementLimit((err, res)=>{
            if(err){
                console.log('Cron service error.')
            }
            else{
                console.log('Cron limit job success.')
            }
        })
    })

    const trending50Job = new cron('1 1 * * * *', ()=>{
        Gallery.getLatest50((err, res)=>{
            if(err){
                console.log(err)
                return
            }
            console.log('Latest 50 galleries.')
        })
    })

    const account_activation_job = new cron('1 1 * * * *', async ()=>{
        console.log('deleting expired account requests')
        try{
            let response = await User.delete_expired_requests()
            console.log('account request job done')

        }
        catch(err){
            console.log('error running activation delete job')
        }

    })
    const clear_view_history_job = new cron('1 1 * * * *', async ()=>{
        console.log('Running clear view history job.')
        try{
            let response = await Gallery.deleteHistoryViews()
            console.log(response)
            console.log('history delete job done')

        }
        catch(err){
            console.log('error running history delete job')
        }
    })


    // init
    limitJob.start()
    trending50Job.start()
    account_activation_job.start()
    clear_view_history_job.start()
}


module.exports = Cron