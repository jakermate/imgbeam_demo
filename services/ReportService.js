const Report = require('../db/models/reports.model')
module.exports = class ReportService{
    async report_gallery(req){
        console.log(req.body)
        let gallery_id = req.params.gallery_id
        let reporting_user = req.user.user_id
        if(!req.body.reason){
            return 500
        }
        let reason = req.body.reason
        let create_response = await Report.create(gallery_id, reporting_user, reason)
        return create_response
    }
  
}