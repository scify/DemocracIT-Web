package democracit.dtos

import java.util.Date

import org.joda.time.DateTime

class Consultation(val id:Int,
                   val startDate:Date,
                   val endDate:Date,
                   val title: String,
                   val shortDescr:String,
                   val organization: Organization,
                   val status: Short,
                   val report_text: String,
                   val articlesNum:Int,
                   val articles:List[Article])

