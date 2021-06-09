import React, {useState, useEffect} from 'react'

export default function ReportView(props) {
    useEffect(()=>{
        getReports()
    },[])
    const [reports, setReports] = useState([])
    async function getReports(){
        let url = `/admin/reports/all`
        try{
            let res = await fetch(url, {
                credentials: 'include'
            })
            console.log(res.status)
            if(res.status === 200){
                let json = await res.json()
                console.log(json)
                setReports(json)
            }
        }
        catch(err){
            console.log(err)
        }
    }
    async function clearReport(report_id){
        let url = `/admin/reports/clear/${report_id}`
        try{
            let res = await fetch(url, {
                credentials: 'include',
                method: 'DELETE'
            })
            if(res.status == 200){
                console.log('report cleared')
                getReports()
            }
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <div>
            {
               
                reports.map((reportObj)=>{
                    return(
                        <div>
                            {reportObj.reason}
                            <button onClick={e => clearReport(reportObj.report_id)}>Clear</button>
                        </div>
                    )
                })
            }
        </div>
    )
}
